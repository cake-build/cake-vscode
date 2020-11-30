#!/bin/bash

echo "Restoring .NET Core tools"
dotnet tool restore

echo "Bootstrapping Cake"
dotnet cake recipe.cake --bootstrap

echo "Running Build"
dotnet cake recipe.cake "$@"
