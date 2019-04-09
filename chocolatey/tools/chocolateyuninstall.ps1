$ErrorActionPreference = 'Stop'

$toolsDir = "$(Split-Path -parent $MyInvocation.MyCommand.Definition)"

Uninstall-VsCodeExtension "cake-build.cake-vscode"
