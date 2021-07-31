const getRandomString = (string_length: number): string => [...Array(string_length)].map(i=>(~~(Math.random()*36)).toString(36)).join('')

export { getRandomString }