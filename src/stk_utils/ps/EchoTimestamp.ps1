$path = (Split-Path -Parent  $MyInvocation.MyCommand.Path) + "\..\json\timestamp.json"
echo $path
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
echo "{""timestamp"":""${timestamp}""}" | Out-File -Encoding utf8  -Force $path