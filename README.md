# Cake

This extension brings language support for [Cake](https://cakebuild.net) build scripts to Visual Studio Code.

## Table of Contents

1. [What is Cake?](#what-is-cake)
2. [Commands](#commands)
3. [Snippets](#snippets)
4. [Task Provider](#task-provider)
5. [Codelens](#codelens)
6. [Resouce Video](#resource-video)
7. [Thanks](#thanks)

## What is Cake?

Cake (C# Make) is a cross platform build automation system with a C# DSL to do things like compiling code, copy files/folders, running unit tests, compress files and build NuGet packages.

For more information about Cake, please see the [Cake website](https://cakebuild.net) or the Cake [source code repository](https://github.com/cake-build/cake).

### Commands

In addition to integrated editing features, the extension also provides commands in the Command Palette for working with Cake files:

* `Cake: Install a bootstrapper` to install a Cake bootstrapper for Windows, OS X or Linux in the root folder.
* `Cake: Install to workspace` will run through all of the available commands at once, to save having to run them one by one
* `Cake: Install debug dependencies` to either install the .NET global tool or alternatively download the Cake.CoreCLR NuGet Package into the tools folder.
* `Cake: Install sample build file` to install a sample Cake File that contains Setup and Teardown actions, a sample task, and argument parsing.
* `Cake: Add addin from NuGet` to add or update an Addin from NuGet in the specified Cake file.
* `Cake: Add tool from NuGet` to add or update a Tool from NuGet in the specified Cake file.
* `Cake: Add module from NuGet` to add or update a Module from NuGet in the modules package.config.
* `Cake: Install a configuration file` to install the default Cake Configuration file for controlling internal components of Cake.
* `Cake: Install intellisense support` to download the Cake.Bakery NuGet Package into the tools folder, which in conjunction with OmniSharp provides intellisense support for Cake Files.

### Snippets

* `cake-addin`
  * Provides a basic addin pre-processor directive, where the package name and version can be changed
  * **Default Value:** `#addin "nuget:?package=Cake.Foo&version=1.2.3"`
* `cake-addin-full`
  * Provides a more complete addin pre-processor directive, where source, package name and version can be changed
  * **Default Value:** `#addin "nuget:https://www.nuget.org/api/v2?package=Cake.Foo&version=1.2.3"`
* `cake-argument`
  * Provides code for basic input argument parsing, where variable name, argument name and default value can be changed
  * **Default Value:** `var target = Argument("target", "Default");`
* `cake-load`
  * Provides a basic load pre-processor directive, where the path to the .cake file can be changed
  * **Default Value:** `#load "scripts/utilities.cake"`
* `cake-load-nuget`
  * Provides a more complex load pre-processor directive, where source, package name and version can be changed
  * **Default Value:** `#load "nuget:https://www.nuget.org/api/v2?package=Cake.Foo&version=1.2.3"`
* `cake-reference`
  * Provides a basic reference pre-processor directive, where path to the assembly can be changed
  * **Default Value:** `#reference "bin/myassembly.dll"`
* `cake-sample`
  * Provides a complete sample Build Cake Script including Setup and Teardown actions, a single task, and argument parsing
* `cake-tool`
  * Provides a basic tool pre-processor directive, where the package name and version can be changed
  * **Default Value:** `#tool "nuget:?package=Cake.Foo&version=1.2.3"`
* `cake-tool-full`
  * Provides a more complete tool pre-processor directive, where source, package name and version can be changed
  * **Default Value:** `#tool "nuget:https://www.nuget.org/api/v2?package=Cake.Foo&version=1.2.3"`
* `task`
  * Provides a basic task definition, where the name of the task can be changed
  * **Default Value:** `Task("name");`
* `task` (With Action)
  * Provides a more complex task definition, including an .Does body, where the name of the task can be changed

### Task Provider

The extension will also parse all `*.cake` files in the workspace and make them executable via the built in `Tasks: Run Task` command.

There are a number of configuration options which allow you to control how the Task Provider works:

* `cake.taskRunner.autoDetect`: a boolean value which toggles auto detection of Tasks on or off.  Default value is `true`
* `cake.taskRunner.scriptsIncludePattern`: a glob pattern which specifies how to detect `.cake` files in the current workspace. Default value is `**/*.cake`.
* `cake.taskRunner.scriptsExcludePattan`: a glob pattern which specifies all files and folders that shouldn't be included in search of current workspace.  Default value is `""`.
* `cake.taskRunner.taskRegularExpression`: a regular expression pattern which is used to identify Tasks within the `*.cake` files. Default value is `Task\\s*?\\(\\s*?\"(.*?)\"\\s*?\\)`.
* `cake.taskRunner.launchCommand`: the name of the build script to run, when running a task.
  This is a complex object, consisting of at least one property `default` and optionally properties corresponding to values of [`os.platform()`](https://nodejs.org/api/os.html#os_os_platform) for non-default values specific to different platforms.
  Default value is `null` which is equal to specifying `{"default": "~/.dotnet/tools/dotnet-cake", "win32": "dotnet-cake.exe"}`.
* `cake.taskRunner.verbosity`: allows you to control cake `run task` verbosity (`diagnostic`, `minimal`, `normal`, `quiet` and `verbose`. Default value is `normal`.

### Codelens

The extension uses codelens to allow you to run and debug tasks individually on any `*.cake` file in your current workspace.

There are a number of configuration options which allow you to control the Cake output verbosity and what host framework to use for the debug session, etc.

* `cake.codeLens.showCodeLens`: a boolean value which toggles codelens on or off. Default value is `true`.
* `cake.codeLens.installNetTool`: a boolean value which configures codelens to install the Cake .NET tool before running or debugging. Default value is `true`.
* `cake.codeLens.scriptsIncludePattern`: a glob pattern which specifies how to detect `.cake` files in the current workspace. Default value is `**/*.cake`.
* `cake.codeLens.taskRegularExpression`: a regular expression pattern which is used to identify Tasks within the `*.cake` files. Default value is `Task\\s*?\\(\\s*?\"(.*?)\"\\s*?\\)`.
* `cake.codeLens.debugTask.verbosity`: allows you to control cake `debug task` verbosity (`diagnostic`, `minimal`, `normal`, `quiet` and `verbose`. Default value is `normal`.
* `cake.codeLens.debugTask.debugType`: framework type of the debug session (`mono`or `coreclr`). Default value is `coreclr`.
* `cake.codeLens.debugTask.request`: request type of the debug session. Default value is `launch`.
* `cake.codeLens.debugTask.program`: executable of the debug session (e.g. `tools/Cake/Cake.exe` for debugType `mono` or `tools/Cake.CoreCLR/Cake.dll` for debugType `coreclr`). 
  This is a complex object, consisting of at least one property `default` and optionally properties corresponding to values of [`os.platform()`](https://nodejs.org/api/os.html#os_os_platform) for non-default values specific to different platforms.
  Default value is `null` which is equal to specifying `{"default": "~/.dotnet/tools/dotnet-cake", "win32": "dotnet-cake.exe"}`.
* `cake.codeLens.debugTask.cwd`: path to the working directory of the program being debugged. Default value is `${workspaceRoot}`.
* `cake.codeLens.debugTask.stopAtEntry`: if true, the debugger should stop at the entry point of the target. Default value is `true`.
* `cake.codeLens.debugTask.console`: console used by the debugger (`internalConsole`, `integratedTerminal` or `externalTerminal`) . Default value is `internalConsole`.
* `cake.codeLens.debugTask.logging.exceptions`: flag to determine whether exception messages should be logged to the output window. Default value is `false`.
* `cake.codeLens.debugTask.logging.moduleLoad`: flag to determine whether module load events should be logged to the output window. Default value is `false`.
* `cake.codeLens.debugTask.logging.programOutput`: flag to determine whether program output should be logged to the output window when not using an external console. Default value is `false`.
* `cake.codeLens.debugTask.logging.engineLogging`: flag to determine whether program output should be logged to the output window when not using an external console. Default value is `false`.
* `cake.codeLens.debugTask.logging.browserStdOut`: flag to determine if stdout text from the launching the web browser should be logged to the output window. Default value is `false`.

**Remark**: While the command to debug a task is configurable using the `cake.codeLens.debugTask.program` setting,
there is no specific setting for configuring the command to run a task. For this case the `cake.taskRunner.launchCommand` setting is used (see above).  In addition, the verbosity used with running a task is controlled via the `cake.taskRunner.verbosity` setting.

### CodeSymbols

The extension produces "code symbols", which are in turn used by Visual Studio Code to produce the code outline and breadcrumb navigation.

There are configuration options to allow you to configure the symbol generation:

* `cake.codeSymbols.contextRegularExpression`: a regular expression pattern to get contexts from Cake script. Default value is `(Setup|TaskSetup|Teardown|TaskTeardown|RunTarget)\\s*?`.
* `cake.codeSymbols.taskRegularExpression`: a regular expression pattern to get tasks from Cake script. Default value is `(Task\\s*?\\(\\s*?\"(.*?)\"\\s*?\\)|Setup\\(.*=>|TearDown\\(.*=>|RunTarget\\(.*\\);)`.

## Resource Video

There is a short introduction video to the Visual Studio Code Extension for Cake here:

[![Introduction to Visual Studio Extension for Cake](https://img.youtube.com/vi/zzZuysl3xSg/0.jpg)](https://www.youtube.com/watch?v=zzZuysl3xSg)


## Thanks

The NuGet commands which have been added to this extension were based on this excellent work in this [VSCode Extension](https://github.com/jmrog/vscode-nuget-package-manager).  Rather than modify the projects `.csproj` or `.fsproj` files, the commands in this extension edit the `.cake` and `packages.config` files.  Our thanks go to [@jmrog](https://github.com/jmrog) for showing how this could be done!
