get-spwebapplication http ://SharePoint | Get-SPSite -Limit all | select url,contentdatabase,@{label="Size in GB";Expression={$_.usage.storage/1GB}} | convertto-csv | set-content "C:TEMPDBsize.csv"
