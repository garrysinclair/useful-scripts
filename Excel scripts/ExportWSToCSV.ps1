Function ExportWSToCSV ($excelFileName, $csvLoc)
{
    $excelFile = $csvLoc + "\" + $excelFileName
    
    Write-Host "Processing $excelFile"
    $E = New-Object -ComObject Excel.Application
    $E.Visible = $true
    $E.DisplayAlerts = $false

    Write-Host "Opening $excelFile"
    $wb = $E.Workbooks.Open($excelFile)

    $wsLogItems = $wb.Worksheets("LogItems")
    $wsLogItems.SaveAs($excelFile + "-LogItems.csv", 6)

    $wsJobs = $wb.Worksheets("Jobs")
    $wsJobs.SaveAs($excelFile + "-Jobs.csv", 6)

    $E.Quit()
}

$csvLov = "C:\Users\gsi\Desktop\KU\Grupperum\Migration logs2"

Get-ChildItem -Path $csvLov -Filter "*.xlsx" |% {

    ExportWSToCSV -excelFileName $_.Name -csvLoc $csvLov

}

