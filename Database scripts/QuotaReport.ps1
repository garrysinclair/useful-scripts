$webapp = Get-SPwebapplication "http ://SharePoint"
$webapp | get-spsite -Limit ALL | ForEach-Object {
$site = $_;
$site;
$site.quota;
}
$site.dispose()
$webapp.dispose()