<html>
<body>
<?php
    $arr = array();
    $handle = opendir('./');
    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != "..") {
            if (is_dir("./$entry")) {
                $arr[$entry] = "[DIR] $entry";
            } else { 
                $arr[$entry] = "$entry";
            }
        }
    }
    closedir($handle);
    natcasesort($arr);
    foreach ($arr as $lnk => $desc) {
        echo "<a href=\"$lnk\">$desc</a><br />";
    }
?>
</body>
</html>
