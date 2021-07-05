let fs = require('fs');
const {  degrees, PDFDocument, rgb, StandardFonts } = require('pdf-lib');

exports.upload = async (req) => {
    try {
        console.log("In Service for Uploading the file", req.file);

        //validate file
        let validation = await this.validateFile(req);
        if (validation != true) {
            fs.unlinkSync(req.file.path);
            throw "File Not Valid";
        } else {

            //adding contents to the given file
            if (req.file) {    
                let options = {
                    "header":"Hi I am Header",
                    "footer":"Hi I am Footer",
                    "waterMark":"Hi I am Water Marks"
                };
                let addHeaderData,addFooterData,addWaterMarkData;
                if (options.header){
                    addHeaderData = await this.addHeader(req,options.header);
                    console.log("afterAddingHeader", addHeaderData);
                }
                if (options.footer){
                    addFooterData = await this.addFooter(req,options.footer);
                    console.log("afterAddingFooter", addFooterData);
                }
                if (options.waterMark){
                    addWaterMarkData = await this.addWaterMark(req,options.waterMark);
                    console.log("afterAddingWaterMark", addWaterMarkData);
                }           
                return req.file.path;
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

//adding header in the file
exports.addHeader = async (req, header) => {
    try{
        let filePath = req.file.path;
        const existingPdfBytes = await fs.readFileSync(filePath);
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        let pageCount  = pdfDoc.getPageCount();
        let pages = pdfDoc.getPages();
            for (let i=0;i<pageCount;i++){
                    const { width, height } = pages[i].getSize();
                    pages[i].drawText(header, {                         
                        x: width / 2 - 80,
                        y: height - 20,
                        size: 20,
                        color: rgb(0.50, 0.15, 0.05)
                    })
                }         
            const pdfBytes = await pdfDoc.save()
            console.log("Check The File",filePath);
            const writingPdfBytes = await fs.writeFileSync(filePath,pdfBytes);
            // fs.unlinkSync(req.file.path);
            return filePath;
    } catch (err){
        return err;
    } finally {
        
    }    
}

//adding footer in the file
exports.addFooter = async (req, footer) => {
    try{
        let filePath = req.file.path;
        const existingPdfBytes = await fs.readFileSync(filePath);
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        let pageCount  = pdfDoc.getPageCount();
        let pages = pdfDoc.getPages();
            for (let i=0;i<pageCount;i++){
                    const { width, height } = pages[i].getSize();
                    pages[i].drawText(footer, { 
                        x: width / 2 - 80,
                        y: 10,
                        size: 20,
                        color: rgb(0.5, 0.15, 0.05)
                    })
                }         
            const pdfBytes = await pdfDoc.save()
            console.log("Check The File",filePath);
            const writingPdfBytes = await fs.writeFileSync(filePath,pdfBytes);
            // fs.unlinkSync(req.file.path);
            return filePath;
    } catch (err){
        return err;
    } finally {
        
    }    
}

//adding waterMark in the file
exports.addWaterMark = async (req, waterMark) => {
    try{
        let filePath = req.file.path;
        const existingPdfBytes = await fs.readFileSync(filePath);
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        let pageCount  = pdfDoc.getPageCount();
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
        let pages = pdfDoc.getPages();
        for (let i=1;i<pageCount;i++){
            const { width, height } = pages[i].getSize()
            pages[i].drawText(waterMark, {
                x: width / 2 - 150,
                y: height / 2 - 150 ,
                size: 50,
                font: helveticaFont,
                color: rgb(0.50, 0.025, 0.005),
                rotate: degrees(45),
                })
        }            
        const pdfBytes = await pdfDoc.save()
        console.log("Check The File",filePath);
        const writingPdfBytes = await fs.writeFileSync(filePath,pdfBytes);
        // fs.unlinkSync(req.file.path);
        return filePath;
    } catch (err){
        return err;
    } finally {
        
    }    
}