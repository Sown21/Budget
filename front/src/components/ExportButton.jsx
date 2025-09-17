import { exportCsv } from "../api/spents";

const ExportButton = ({ userId }) => {
    const handleExport = async () => {
        const response = await exportCsv(userId);
        const disposition = response.headers['content-disposition'];
        let filename = "spents.csv";
        if (disposition && disposition.includes('filename=')) {
            filename = disposition.split('filename=')[1].replace(/"/g, '');
        }
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    return <button className="btn_file" onClick={handleExport}>Exporter</button>;
};

export default ExportButton;