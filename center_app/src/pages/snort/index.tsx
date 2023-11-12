import { ip } from '@/utils/ip';
import { UploadOutlined } from '@ant-design/icons';
import { Divider, List, Spin, Table, Typography, Form, Upload, UploadFile, Button, Input, message, Image, Card } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import styles from './index.less';

const renderImage = (src: string) => {
  return <Image src={src} className={styles.imageSnort}/>
}

const DlpMain = () => {
  const snortsModel = useModel('snorts');

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);

  const handleSubmit = async(event) => {
    event.preventDefault()
    const formSnort = document.getElementById('formSnort') as HTMLFormElement;
    const formData = new FormData(formSnort);
    if (selectedFile == null || selectedFile2 == null) {
      message.warning("Vui lòng chọn file đầu vào")
      return
    }
    snortsModel.up({formData});
  }

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files)
  }

  const handleFileSelect2 = (event) => {
    setSelectedFile2(event.target.files)
  }

  const handleDownload = (event) => {
    event.preventDefault()
    snortsModel.dowload();
  }

  useEffect(() => {
    snortsModel.getData();
  }, []);

  useEffect(() => {
    if(snortsModel.data.length > 0){
      snortsModel.getImage();
    }
  }, [snortsModel.data]);

  return (
    // <Spin spinning={ettercap.loading}>
    <div className={styles.nmapGlobal}>
      <Card>
        <div className={styles.upfileForm}>
          <div className={styles.dowload}>
            <Typography.Title className={styles.dowloadTitle} level={4}>Tự động sinh luật snort</Typography.Title>
          </div>
          <Form  id="formSnort" name='upload' className={styles.form} layout='inline'>
            <Form.Item label='File nornal  (.pcap)' required >
              <Input type="file" name='benign' onChange={handleFileSelect} accept=".pcap" multiple/>
            </Form.Item>
            <Form.Item label='File tấn công (.pcap)' required >
              <Input type="file" name='attack' onChange={handleFileSelect2} accept=".pcap" multiple/>
            </Form.Item>
          <Button type="primary" className={styles.button} onClick={handleSubmit} loading={snortsModel.loading}>Submit</Button>
          
        </Form>
        </div>
      </Card>
      
      <Card>
        <div className={styles.dowloadForm}>
          <div className={styles.dowload}>
            <Typography.Title className={styles.dowloadTitle} level={4}>File snort.rules mới nhất</Typography.Title>
            <Button type="primary" className={styles.button} onClick={handleDownload} >Tải xuống</Button>
          </div>
          {snortsModel.data.length > 0 && (
            <div className={styles.huongdan}>
              <List
                size="small"
                bordered
                loading={snortsModel.loading}
                dataSource={snortsModel.data}
                renderItem={(item) => <List.Item>{item}</List.Item>}
                />
            </div>
          )}
        </div>
        <div className={styles.dowloadForm}>
          <div className={styles.dowload}>
            <Typography.Title className={styles.dowloadTitle} level={4}>Cây mới nhất</Typography.Title>
          </div>
          {snortsModel.data.length > 0 && (
            <div className={styles.imageSnortContainer}>
              {snortsModel.image && renderImage(snortsModel.image?.src)}
            </div>
          )}
        </div>
    </Card>
  </div>
    // </Spin>
  );
};

export default DlpMain;
