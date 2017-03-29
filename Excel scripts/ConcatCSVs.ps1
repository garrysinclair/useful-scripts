$csvLov = "C:\Users\gsi\Desktop\KU\Grupperum\Migration logs2"

function Write-File {
    [cmdletbinding()]
    param([string]$filename, 
    [Parameter(ValueFromPipeline)]
    $dataLine
    )
    Begin {
        $stream = new-object -TypeName System.IO.StreamWriter($filename,$false,[System.Text.Encoding]::UTF8)
         
    }
    Process {
        $stream.WriteLine($dataLine)
    }
    End {
        $stream.Close()
    }
}

Get-ChildItem -Path $csvLov -Filter "J*-LogItems.csv" |% {

    Import-Csv -Delimiter ',' -Encoding UTF8 -Path $_.FullName
    
    #Write-Host $_.FullName

    
} | ConvertTo-Csv -Delimiter ',' -NoTypeInformation | Write-File -filename "$csvLov\ALL-LogItems.csv"

Get-ChildItem -Path $csvLov -Filter "J*-Jobs.csv" |% {

    Import-Csv -Delimiter ',' -Encoding UTF8 -Path $_.FullName
    
    #Write-Host $_.FullName

    
} | ConvertTo-Csv -Delimiter ',' -NoTypeInformation | Write-File -filename "$csvLov\ALL-Jobs.csv"


