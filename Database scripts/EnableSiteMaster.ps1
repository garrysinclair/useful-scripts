Enable-SPWebTemplateForSiteMaster -Template "STS#0" -CompatibilityLevel 15

$db = Get-SPContentDatabase -Site http://someserverurl

New-SPSiteMaster -ContentDatabase $db -Template "STS#0"

New-SPSite http://someserverurl/sites/testone -ContentDatabase $db -CompatibilityLevel 15 -CreateFromSiteMaster -Template "STS#0" -OwnerAlias "SP2016\Ronald"
