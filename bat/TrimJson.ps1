Param($dir) 
$fileNameList = Get-ChildItem -File $dir 

# 取得したファイル数分ループする
foreach($name in $fileNameList )
{
    $path = Join-Path -Path $dir -ChildPath $name
    Write-Host $path
    $lfText = [System.IO.File]::ReadAllText($path) -replace "`n *",""
    [System.IO.File]::WriteAllText($path, $lfText)
}

