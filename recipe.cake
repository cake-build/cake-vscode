#load "nuget:https://www.nuget.org/api/v2?package=Cake.VsCode.Recipe&version=0.4.0"

if(BuildSystem.IsLocalBuild)
{
    Environment.SetVariableNames(
        githubTokenVariable: "CAKE_GITHUB_PAT"
    );
}
else
{
    Environment.SetVariableNames();
}

BuildParameters.SetParameters(context: Context,
                            buildSystem: BuildSystem,
                            title: "cake-vscode",
                            repositoryOwner: "cake-build",
                            repositoryName: "cake-vscode",
                            appVeyorAccountName: "cakebuild",
                            shouldRunGitVersion: true,
                            vsceVersionNumber:"1.78.0",
                            typeScriptVersionNumber: "4.1.2",
                            marketPlacePublisher: "cake-build");

BuildParameters.PrintParameters(Context);

Build.Run();
