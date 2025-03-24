#cmd
for %i in (src\*.ts) do esbuild %i --outfile=output\%~ni.js --format=esm --platform=browser --target=es6



# powershell
Get-ChildItem -Path src -Filter *.ts | ForEach-Object {
    esbuild $_.FullName --outfile="output\$($_.BaseName).js" --format=esm --platform=browser --target=es6
}
