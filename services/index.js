let fs = require('fs');
const {  degrees, PDFDocument, rgb, StandardFonts } = require('pdf-lib');
// import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
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
                
                // const writingPdfBytes = await fs.writeFileSync("./uploads/newFile1.pdf",pdfBytes);
                let options = {
                    // "header":"Hi I am Header",
                    // "footer":"Hi I am Footer",
                    "waterMark":"Hi I am Water Marks"
                };
                console.log("opjaf",options.waterMark);
                let addData = await this.add(req,options);
                console.log("afterAdding", addData);
                return addData;
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
exports.add = async (req, options) => {
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
    if (options.waterMark) {
        let filePath = req.file.path;
        const existingPdfBytes = await fs.readFileSync(filePath);
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        let pageCount  = pdfDoc.getPageCount();
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
        const pages = pdfDoc.getPages()
        for (let i=1;i<pageCount;i++){
            const { width, height } = pages[i].getSize()
            pages[i].drawText(options.waterMark, {
                x: width / 2 - 150,
                y: height / 2 - 150 ,
                size: 50,
                font: helveticaFont,
                color: rgb(0.95, 0.1, 0.1),
                rotate: degrees(45),
                })
        }          
        const pdfBytes = await pdfDoc.save()
        console.log("Check The File",filePath);
        const writingPdfBytes = await fs.writeFileSync(filePath,pdfBytes);
        // fs.unlinkSync(req.file.path);
        return filePath;
    }

    console.log("pages", pdfDoc.getPages());
    console.log("adding", pdfDoc.save());
}
