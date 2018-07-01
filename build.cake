//////////////////////////////////////////////////////////////////////
// ADDINS
//////////////////////////////////////////////////////////////////////

#addin "nuget:?package=MagicChunks&version=1.2.0.58"
#addin "nuget:?package=Cake.VsCode&version=0.8.0"
#addin "nuget:?package=Cake.Npm&version=0.10.0"
#addin "nuget:?package=Cake.AppVeyor&version=1.1.0.9"

//////////////////////////////////////////////////////////////////////
// TOOLS
//////////////////////////////////////////////////////////////////////

#tool "nuget:?package=gitreleasemanager&version=0.7.0"
#tool "nuget:?package=GitVersion.CommandLine&version=3.6.5"

// Load other scripts.
#load "./build/parameters.cake"

//////////////////////////////////////////////////////////////////////
// PARAMETERS
//////////////////////////////////////////////////////////////////////

BuildParameters parameters = BuildParameters.GetParameters(Context, BuildSystem);
bool publishingError = false;

///////////////////////////////////////////////////////////////////////////////
// SETUP / TEARDOWN
///////////////////////////////////////////////////////////////////////////////

Setup(context =>
{
    parameters.SetBuildVersion(
        BuildVersion.CalculatingSemanticVersion(
            context: Context,
            parameters: parameters
        )
    );

    Information("Building version {0} of cake-vscode ({1}, {2}) using version {3} of Cake. (IsTagged: {4})",
        parameters.Version.SemVersion,
        parameters.Configuration,
        parameters.Target,
        parameters.Version.CakeVersion,
        parameters.IsTagged);
});

//////////////////////////////////////////////////////////////////////
// TASKS
//////////////////////////////////////////////////////////////////////

Task("Clean")
    .Does(() =>
{
    CleanDirectories(new[] { "./build-results" });
});

Task("Npm-Install")
    .Does(() =>
{
    var settings = new NpmInstallSettings();
    settings.LogLevel = NpmLogLevel.Silent;
    NpmInstall();
});

Task("Install-TypeScript")
    .Does(() =>
{
    var settings = new NpmInstallSettings();
    settings.Global = true;
    settings.AddPackage("typescript", "2.9.2");
    settings.LogLevel = NpmLogLevel.Silent;
    NpmInstall(settings);
});

Task("Install-Vsce")
    .Does(() =>
{
    var settings = new NpmInstallSettings();
    settings.Global = true;
    settings.AddPackage("vsce", "1.43.0");
    settings.LogLevel = NpmLogLevel.Silent;
    NpmInstall(settings);
});

Task("Create-Release-Notes")
    .Does(() =>
{
    GitReleaseManagerCreate(parameters.GitHub.UserName, parameters.GitHub.Password, "cake-build", "cake-vscode", new GitReleaseManagerCreateSettings {
        Milestone         = parameters.Version.Milestone,
        Name              = parameters.Version.Milestone,
        Prerelease        = true,
        TargetCommitish   = "master"
    });
});

Task("Update-Project-Json-Version")
    .WithCriteria(() => !parameters.IsLocalBuild)
    .Does(() =>
{
    var projectToPackagePackageJson = "package.json";
    Information("Updating {0} version -> {1}", projectToPackagePackageJson, parameters.Version.SemVersion);

    TransformConfig(projectToPackagePackageJson, projectToPackagePackageJson, new TransformationCollection {
        { "version", parameters.Version.SemVersion }
    });
});

Task("Package-Extension")
    .IsDependentOn("Update-Project-Json-Version")
    .IsDependentOn("Npm-Install")
    .IsDependentOn("Install-TypeScript")
    .IsDependentOn("Install-Vsce")
    .IsDependentOn("Clean")
    .Does(() =>
{
    var buildResultDir = Directory("./build-results");
    var packageFile = File("cake-vscode-" + parameters.Version.SemVersion + ".vsix");

    VscePackage(new VscePackageSettings() {
        OutputFilePath = buildResultDir + packageFile
    });
});

Task("Upload-AppVeyor-Artifacts")
    .IsDependentOn("Package-Extension")
    .WithCriteria(() => parameters.IsRunningOnAppVeyor)
.Does(() =>
{
    var buildResultDir = Directory("./build-results");
    var packageFile = File("cake-vscode-" + parameters.Version.SemVersion + ".vsix");
    AppVeyor.UploadArtifact(buildResultDir + packageFile);
});

Task("Publish-GitHub-Release")
    .IsDependentOn("Package-Extension")
    .WithCriteria(() => parameters.ShouldPublish)
    .Does(() =>
{
    var buildResultDir = Directory("./build-results");
    var packageFile = File("cake-vscode-" + parameters.Version.SemVersion + ".vsix");

    GitReleaseManagerAddAssets(parameters.GitHub.UserName, parameters.GitHub.Password, "cake-build", "cake-vscode", parameters.Version.Milestone, buildResultDir + packageFile);
    GitReleaseManagerClose(parameters.GitHub.UserName, parameters.GitHub.Password, "cake-build", "cake-vscode", parameters.Version.Milestone);
})
.OnError(exception =>
{
    Information("Publish-GitHub-Release Task failed, but continuing with next Task...");
    publishingError = true;
});

Task("Publish-Extension")
    .IsDependentOn("Package-Extension")
    .WithCriteria(() => parameters.ShouldPublish)
    .Does(() =>
{
    var buildResultDir = Directory("./build-results");
    var packageFile = File("cake-vscode-" + parameters.Version.SemVersion + ".vsix");

    VscePublish(new VscePublishSettings(){
        PersonalAccessToken = parameters.Marketplace.Token,
        Package = buildResultDir + packageFile
    });
})
.OnError(exception =>
{
    Information("Publish-Extension Task failed, but continuing with next Task...");
    publishingError = true;
});

//////////////////////////////////////////////////////////////////////
// TASK TARGETS
//////////////////////////////////////////////////////////////////////

Task("Default")
    .IsDependentOn("Package-Extension");

Task("Appveyor")
    .IsDependentOn("Upload-AppVeyor-Artifacts")
    .IsDependentOn("Publish-GitHub-Release")
    .IsDependentOn("Publish-Extension")
    .Finally(() =>
{
    if(publishingError)
    {
        throw new Exception("An error occurred during the publishing of cake-vscode.  All publishing tasks have been attempted.");
    }
});

Task("ReleaseNotes")
    .IsDependentOn("Create-Release-Notes");

//////////////////////////////////////////////////////////////////////
// EXECUTION
//////////////////////////////////////////////////////////////////////

RunTarget(parameters.Target);
