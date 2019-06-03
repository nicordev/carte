<?php
ob_start();
?>

<script type="text/javascript">
	<?php
	if (isset($msg)) {
		echo 'var msgBox = new MsgBox("' . $msg . '", 2000);
			msgBox.show();';
	}
	?>
</script>

<h2 class="pageTitle">Parcours enregistrés</h2>

<table>
	<tr>
		<th>Nom</th>
		<th>Action</th>
	</tr>
	<?php if (isset($hikes)) { fillHtmlArrayWithHikes($hikes); } ?>
</table>

<?php
include("include/backToHome.php");

$content = ob_get_clean();

require ('template.php');
?>