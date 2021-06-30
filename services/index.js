let fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const PDFKitDocument = require('pdfkit');

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
                const newPdfDoc = await PDFDocument.create();
                const existingPdfBytes = await fs.readFileSync(filePath);

                const pdfDoc = await PDFDocument.load(existingPdfBytes);
                console.log(pdfDoc.getPageCount());
                //Copying Contents
                const [firstDonorPage] = await newPdfDoc.copyPages(pdfDoc, [0]);
                const [secondDonorPage] = await newPdfDoc.copyPages(pdfDoc, [2]);
                newPdfDoc.addPage(firstDonorPage);
                newPdfDoc.insertPage(0, secondDonorPage);

                const pdfBytes = await newPdfDoc.save()

                console.log("Check The File",filePath);
                // const writingPdfBytes = await fs.writeFileSync(filePath,pdfDoc);
                const writingPdfBytes = await fs.writeFileSync("./uploads/newFile.pdf",pdfBytes);
                // let options = {};
                // let addData = await this.add(pdfDoc, options);
                // console.log("afterAdding", addData);
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
