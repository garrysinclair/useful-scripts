Get-SPContentDatabase | foreach {$_;
  try {
      $rbs = $_.RemoteBlobStorageSettings;
      write-host "Provider  Name=$($rbs.GetProviderNames())";
      write-host "Enabled=$($rbs.enabled)";
      write-host "Min Blob  Size=$($rbs.MinimumBlobStorageSize)"
      }
  catch
  {write-host -foregroundcolor red "RBS not installed on this database!`n"}
  finally {write-host "End`n"}
}