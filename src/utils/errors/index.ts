const errors: { [key: string]: string } = {
    "0": "Something went wrong",
    "-32000": "There are not enough funds on the balance."
};


export const generateError = (e: Error) => {
    const substr = `code": `;
    if (!e.message && !e.message?.indexOf(substr)) {
        return errors["0"];
    }
    const index = e.message.indexOf(substr);
    const sliced = e.message.slice(index + substr.length);
    const [code] = sliced.split(",");
    return errors[code] || errors["0"];

};


export default generateError;
