get-SPWebApplication http ://SharePoint | Get-SPTimerJob | select name

$SubTJ = Get-SPTimerJob "job-change-log-expiration" -WebApplication $wa
$SubTJ.RunNow()

$wa=Get-SPWebApplication http ://SharePoint
[TimeSpan]$OneDay=[timespan]"1.00:00:00"
[TimeSpan]$TargetDuration=[timespan]"30.00:00:00"
while ($wa.ChangeLogRetentionPeriod -gt $TargetDuration)
{
    $wa.ChangeLogRetentionPeriod=$wa.ChangeLogRetentionPeriod-$OneDay
    $wa.Update()
    $SubTJ = Get-SPTimerJob "job-change-log-expiration" -WebApplication $wa
         $SubTJ.RunNow()
    Write-Host -ForegroundColor DarkGreen "Change Log Retention Period reduced by a single day to $($wa.ChangeLogRetentionPeriod.Days)"
    Start-Sleep -s 600
}
 
Write-Host -ForegroundColor DarkRed "Already reduced the Change Log Retention Period to target"