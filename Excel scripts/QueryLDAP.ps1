# Ændre LDAP path
$ldapConnection = "LDAP://OU=Delegate,OU=Medarbejdere,OU=Personer,dc=delegate,dc=local" 

# Evt. angive valid sti til output filen
$csvFilePath = "c:\temp\dataExport.csv" 

# AD Fields 
$userField = "UserPrincipalName"
$locationField = "City"
$countryField = "Country/region"
$divisionField = "Division"

# Opsætning af LDAP søgning
$strFilter = "(objectCategory=User)"

$objOU = New-Object System.DirectoryServices.DirectoryEntry($ldapConnection)

$objSearcher = New-Object System.DirectoryServices.DirectorySearcher
$objSearcher.SearchRoot = $objOU
$objSearcher.PageSize = 1000
$objSearcher.Filter = $strFilter
$objSearcher.SearchScope = "Subtree"

$colProplist = $userField, $countryField, $locationField, $divisionField

foreach ($i in $colPropList){$objSearcher.PropertiesToLoad.Add($i)}

# Udfør søgning
$colResults = $objSearcher.FindAll()

# Behandle resultater
$results = @()

foreach ($objResult in $colResults){
    $objItem = $objResult.Properties; 
    $user = $objItem[$userField]
    $country = $objItem[$countryField]
    $location = $objItem[$locationField]
    $division = $objItem[$divisionField]

    $details = @{     
                User       = $($user)       
                Country    = $($country)              
                Location   = $($location)
                Division   = $($division)
        }                           
    $results += New-Object PSObject -Property $details  
}

# Eksporter til CSV
$results | Export-Csv $csvFilePath -NoTypeInformation
