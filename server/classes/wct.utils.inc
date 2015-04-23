<?php
/**
 * Class regrouping some various utility functions.
 *
 * @author <a href="mailto:jlanglade@gmail.com">J&eacute;r&eacute;mie Langlade</a>
 * @since 0.1
 */
class wctUtils {
	/**
	 * Function to test if mod_rewrite is available.
	 *
	 * @param io
	 *     Indicates if the function must output an html result.
	 * @return <code>true</code> if mod_rewrite is present and <code>false</code> elsewhere.
	 * @since 0.1
	 */
	public static function testModRewrite($io = true) {
		if (function_exists('apache_get_modules')) {
			$test = in_array("mod_rewrite", apache_get_modules());
			if ($io == true) {
				if ($test) {
					echo('<div class="alert alert-success" role="alert"><span class="glyphicon glyphicon-check"></span> <span data-i18n="install.modrewrite.ok"></span></div>');
				} else {
					echo('<div class="alert alert-danger" role="alert"><span class="glyphicon glyphicon-unchecked"></span> <span data-i18n="install.modrewrite.ko"></span></div>');
				}
			}
			return $test;
		} else {
			// Apache not present. Assume yes.
			return true;
		}
	}

	/**
	 * Test if a directory or a file is writeable.
	 *
	 * @param file
	 *     The directory path or file to test.
	 * @return <code>true</code> if <code>file</code> is writeable and <code>false</code> elsewhere.
	 * @since 0.1
	 */
	public static function testWrite($file) {
		if(is_writable($file)) {
			echo('<div class="alert alert-success" role="alert"><span class="glyphicon glyphicon-check"></span> <span data-i18n="install.write.ok" data-i18n-options="{&quot;file&quot;:&quot;' . addslashes($file) . '&quot;}"></span></div>');
		} else {
			echo('<div class="alert alert-danger" role="alert"><span class="glyphicon glyphicon-unchecked"></span> <span data-i18n="install.write.ko" data-i18n-options="{&quot;file&quot;:&quot;' . addslashes($file) . '&quot;}"></span></div>');
		}
	}
}
?>