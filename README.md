# Cake

This addin brings language support for [Cake](https://cakebuild.net) build scripts to Visual Studio Code.

### Commands

In addition to integrated editing features, the extension also provides commands in the Command Palette for working with Cake files:

* `Cake: Install a bootstrapper` to install a Cake bootstrapper for Windows, OS X or Linux in the root folder.
* `Cake: Install to workspace` will run through all of the available commands at once, to save having to run them one by one
* `Cake: Install debug dependencies` to download the Cake.CoreCLR NuGet Package into the tools folder, ready for enabling debugging
* `Cake: Install sample build file` to install a sample Cake File that contains Setup and Teardown actions, a sample task, and argument parsing.
* `Cake: Add addin from NuGet` to add or update an Addin from NuGet in the specified Cake file.
* `Cake: Add tool from NuGet` to add or update a Tool from NuGet in the specified Cake file.
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
* `cake.taskRunner.scriptsIncludePattern`: a glob pattern which specifies how to detect `.cake` files in the current workspace.  Default value is `**/*.cake`.
* `cake.taskRunner.scriptsExcludePattan`: a glob pattern which specifies all files and folders that shouldn't be included in search of current workspace.  Default value is `""`.
* `cake.taskRunner.taskRegularExpression` a regular expression pattern which is used to identify Tasks within the `*.cake` files.  Default value is `Task\\s*?\\(\\s*?\"(.*?)\"\\s*?\\)`

## What is Cake?

Cake (C# Make) is a cross platform build automation system with a C# DSL to do things like compiling code, copy files/folders, running unit tests, compress files and build NuGet packages.

## Learn more

For more information about Cake, please see the [Cake website](https://cakebuild.net) or the Cake [source code repository](https://github.com/cake-build/cake).

## Resource Video

There is a short introduction video to the Visual Studio Code Extension for Cake here:

[![Introduction to Visual Studio Extension for Cake](https://img.youtube.com/vi/zzZuysl3xSg/0.jpg)](https://www.youtube.com/watch?v=zzZuysl3xSg)
