const collator = new Intl.Collator(
	"en",
	{
		numeric: true,
		sensitivity: "variant",
		usage: "sort",
		caseFirst: "upper"
	}
);

export default collator;
