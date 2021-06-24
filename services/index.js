let fs = require('fs');
const { PDFDocument } = require('pdf-lib');

exports.upload = async (req) => {
    try {
        console.log("In Service for Uploading the file", req.file);

        //validate file
        let validation = await this.validateFile(req);
        if (validation != true) {
            fs.unlinkSync(req.file.path);
            throw "File Not Valid";
        } else {

            //adding 
            if (req.file) {
                let filePath = req.file.path;
                const existingPdfBytes = await fs.readFileSync(filePath);

                const pdfDoc = await PDFDocument.load(existingPdfBytes);

                let options = {
                    header: {
                        x: 25,
                        y: 45,
                        width: 200,
                        height: 100,
                        textColor: rgb(1, 0, 0),
                        backgroundColor: rgb(0, 1, 0),
                        borderColor: rgb(0, 0, 1),
                        borderWidth: 2,
                        rotate: degrees(90)
                    },
                    footer: {
                        x: 50,
                        y: 75,
                        width: 200,
                        height: 100,
                        textColor: rgb(1, 0, 0),
                        backgroundColor: rgb(0, 1, 0),
                        borderColor: rgb(0, 0, 1),
                        borderWidth: 2,
                        rotate: degrees(90)
                    }
                };
                let addData = await this.add(pdfDoc, options);
                console.log("afterAdding", addData);
            } else if (req.body) {

            }
        }

    } catch (e) {
        console.log("Error in Service Uploading", e);
        throw e;
    } finally {
        console.log("In Finally Service Uploading");
    }
}

//File Validation
exports.validateFile = async (req) => {
    if (req.file.mimetype != 'application/pdf') {
        return false;
    } else {
        return true;
    }
}

//adding in the file
exports.add = async (pdfDoc, options) => {
    const page = pdfDoc.addPage()
    if (options.header) {
        const form = pdfDoc.getForm()
        const textField = form.createTextField('Header');
        textField.setText('Exia')
        textField.addToPage(page, options.header);
    }
    if (options.footer) {
        const form = pdfDoc.getForm()
        const textField = form.createTextField('best.gundam')
        textField.setText('Exia')
        textField.addToPage(page, options.footer);
    }

    console.log("pages", pdfDoc.getPages());
    console.log("adding", pdfDoc.save());
}
