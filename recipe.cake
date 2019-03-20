#load "nuget:https://www.nuget.org/api/v2?package=Cake.VsCode.Recipe&version=0.1.0"

Environment.SetVariableNames();

BuildParameters.SetParameters(context: Context,
                            buildSystem: BuildSystem,
                            title: "cake-vscode",
                            repositoryOwner: "cake-build",
                            repositoryName: "cake-vscode",
                            appVeyorAccountName: "cakebuild",
                            shouldRunGitVersion: true);

BuildParameters.PrintParameters(Context);

Build.Run();
