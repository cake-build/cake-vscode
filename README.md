# Cake

This addin brings language support for [Cake](http://cakebuild.net) build scripts to Visual Studio Code.

### Commands

In addition to integrated editing features, the extension also provides commands in the Command Palette for working with Cake files:

* `Cake: Download Debug Dependencies` to download the Cake.CoreCLR NuGet Package into the tools folder, ready for enabling debugging
* `Cake: Install a bootstrapper` to install a Cake bootstrapper for Windows, OS X or Linux in the root folder.
* `Cake: Install a configuration file` to install the default Cake Configuration file for controlling internal components of Cake.

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

For more information about Cake, please see the [Cake website](http://cakebuild.net) or the Cake [source code repository](https://github.com/cake-build/cake).

## Resource Video

There is a short introduction video to the Visual Studio Code Extension for Cake here:

[![Introduction to Visual Studio Extension for Cake](https://img.youtube.com/vi/zzZuysl3xSg/0.jpg)](https://www.youtube.com/watch?v=zzZuysl3xSg)
