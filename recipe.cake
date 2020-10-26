#load "nuget:https://www.nuget.org/api/v2?package=Cake.VsCode.Recipe&version=0.2.0"

if(BuildSystem.IsLocalBuild)
{
    Environment.SetVariableNames(
        githubUserNameVariable: "CAKE_GITHUB_USERNAME",
        githubPasswordVariable: "CAKE_GITHUB_PASSWORD"
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
                            typeScriptVersionNumber: "4.0.2");

BuildParameters.PrintParameters(Context);

Build.Run();
