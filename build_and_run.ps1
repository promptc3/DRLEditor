# Check if "--release" flag is present in the script arguments
$releaseFlagPresent = $args.Contains("--release")

# Step 1: Run "npm run build" in current folder
npm run build

if ($LASTEXITCODE -eq 0) {

    $sourcePath = "$PSScriptRoot\dist\*" # Assuming the dist folder is in the current directory
    $destinationPath = "C:\Users\sausau\Mendix\Syncron-Widgets-main\CustomWidgets\drlEditor\src\utils"
    Copy-Item -Path $sourcePath -Destination $destinationPath -Recurse -Force

    if ($releaseFlagPresent) {
        Write-Output "Building widget ..."
        Set-Location "C:\Users\sausau\Mendix\Syncron-Widgets-main\CustomWidgets\drlEditor"
        npm run build

        Write-Output "Starting widget server ..."
        npm run start
    } else {
        Write-Output "Bundling succeded for current project."
    }
} else {
    Write-Output "Package build failed. Exiting script."
}

