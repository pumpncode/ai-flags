const {
	readTextFile
} = Deno;

const cssText = await readTextFile("./components/style/base.css");

const BaseStyle = () => (
	<style
		dangerouslySetInnerHTML={{
			__html: cssText
		}}
	/>
);

export default BaseStyle;