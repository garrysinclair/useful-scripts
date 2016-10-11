Get-SPDatabase | select name,DiskSizeRequired | convertto-csv | set-content "C:DBsize.csv"

