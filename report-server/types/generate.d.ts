export interface e2eRcInterface {
	projectPath: string,
	sequence: string[],
	reportsDir: string,
	testSuitsDir: string,
	record: boolean,
	testAccountC?: string,
	useTS: boolean
}


export interface minitestCmdInterface {
	command: string
}
