import pool from '../db/pool.js';
import { exportDispatcher } from '../services/exportServices/exportDispatcher.js';

export const exportDocument = async (req, res) => {
    try {
        const { documentId } = req.params;

        const format = req.query.format || 'json';

        const { rows } = await pool.query(
            `SELECT results.*, documents.original_filename
            FROM results
            JOIN documents ON results.document_id=documents.document_id
            WHERE results.document_id= $1`,
            [documentId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ Message: "Result not found" });
        }

        const exportRes = await exportDispatcher(rows[0], format);



        const filename = rows[0].original_filename;
        const extension = format === 'json' ? '.json' : '.txt';
        const contentType = format === 'json' ? 'application/json' : 'text/plain';
        const exportFilename = `${filename}${extension}`;

        res.setHeader('Content-Disposition', `attachment; filename="${exportFilename}"`);
        res.setHeader('Content-Type', contentType);
        res.status(200).send(exportRes);


    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}