<?php
ob_start();
if (isset($msg)) {
	?>
<script type="text/javascript">
	var msgBox = new MsgBox();
	msgBox.show("<?= $msg ?>", 3000);
</script>
	<?php
}
?>

<h1><p id="where_am_i_link"><a href="index.php?page=recording">Où suis-je ?</a></p></h1>

<h2><a id="history_link" href="index.php?page=history">Parcours enregistrés</a></h2>

<?php
$content = ob_get_clean();

require ('template.php');
?>