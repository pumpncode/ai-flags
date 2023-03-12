const {
	readTextFile
} = Deno;

const cssText = await readTextFile("./components/style/fonts.css");

const FontsStyle = () => (
	<style
		dangerouslySetInnerHTML={{
			__html: cssText
		}}
	/>
);

export default FontsStyle;