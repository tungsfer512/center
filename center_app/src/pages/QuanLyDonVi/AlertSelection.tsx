import { Button, Card, Checkbox, Divider, Form, List } from 'antd'
import Title from 'antd/lib/typography/Title'
import { values } from 'lodash'
import React, { useEffect } from 'react'
import { useModel } from 'umi'

const AlertSelection = () => {
    const alertModel = useModel('alerts_send')
    const path = window.location.pathname
    const device_id = path.split('/')[2]

    useEffect(() => {
        alertModel.getMailAlert(device_id)
        alertModel.getSmsAlert(device_id)
    }, [])

    const [formMail] = Form.useForm()
    const [formSms] = Form.useForm()

    const handlePutMailAlert = (values: any) => {
        alertModel.putMailAlert({...alertModel.mailAlert})
    }

    const handlePutSmsAlert = (values: any) => {
        alertModel.putSmsAlert({...alertModel.smsAlert})
    }

    return (
        <div style={{display: 'flex', gap: '16px', flexDirection: 'column'}}>
            <Card style={{flexGrow: 1}}>
                <Title level={3}>Cài đặt thông báo mail</Title>
                <Form 
                    name="basic"
                    initialValues={ alertModel.mailAlert }
                    form = {formMail}
                    onFinish={handlePutMailAlert}
                    style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '16px'}}
                >
                    {/* {JSON.stringify(alertModel.mailAlert)} */}
                    <Form.Item name="network">
                        <Checkbox checked={alertModel.mailAlert?.network} onChange={() => alertModel.setMailAlert({...alertModel.mailAlert, network: !alertModel.mailAlert?.network})}
                        >Network</Checkbox>
                    </Form.Item>
                    <Form.Item name="malware">
                        <Checkbox checked={alertModel.mailAlert?.malware} onChange={() => alertModel.setMailAlert({...alertModel.mailAlert, malware: !alertModel.mailAlert?.malware})}
                        >Malware</Checkbox>
                    </Form.Item>
                    <Form.Item name="syscall">
                        <Checkbox checked={alertModel.mailAlert?.syscall} onChange={() => alertModel.setMailAlert({...alertModel.mailAlert, syscall: !alertModel.mailAlert?.syscall})}
                        >Syscall</Checkbox>
                    </Form.Item>
                    <Form.Item name="log">
                        <Checkbox checked={alertModel.mailAlert?.log} onChange={() => alertModel.setMailAlert({...alertModel.mailAlert, log: !alertModel.mailAlert?.log})}
                        >Log</Checkbox>
                    </Form.Item>
                    <Form.Item name="ips">
                        <Checkbox checked={alertModel.mailAlert?.ips} onChange={() => alertModel.setMailAlert({...alertModel.mailAlert, ips: !alertModel.mailAlert?.ips})}
                        >Rule base</Checkbox>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={alertModel.loading[0]}> Lưu </Button>
                </Form>
            </Card>
            <Card style={{flexGrow: 1}}>
                <Title level={3}>Cài đặt thông báo sms</Title>
                <Form 
                    name="basic"
                    initialValues={ alertModel.smsAlert }
                    form = {formSms}
                    onFinish={handlePutSmsAlert}
                    style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '16px'}}
                >
                    {/* {JSON.stringify(alertModel.smsAlert)} */}
                    <Form.Item name="network">
                        <Checkbox checked={alertModel.smsAlert?.network} onChange={() => alertModel.setSmsAlert({...alertModel.smsAlert, network: !alertModel.smsAlert?.network})}
                        >Network</Checkbox>
                    </Form.Item>
                    <Form.Item name="malware">
                        <Checkbox checked={alertModel.smsAlert?.malware} onChange={() => alertModel.setSmsAlert({...alertModel.smsAlert, malware: !alertModel.smsAlert?.malware})}
                        >Malware</Checkbox>
                    </Form.Item>
                    <Form.Item name="syscall">
                        <Checkbox checked={alertModel.smsAlert?.syscall} onChange={() => alertModel.setSmsAlert({...alertModel.smsAlert, syscall: !alertModel.smsAlert?.syscall})}
                        >Syscall</Checkbox>
                    </Form.Item>
                    <Form.Item name="log">
                        <Checkbox checked={alertModel.smsAlert?.log} onChange={() => alertModel.setSmsAlert({...alertModel.smsAlert, log: !alertModel.smsAlert?.log})}
                        >Log</Checkbox>
                    </Form.Item>
                    <Form.Item name="ips">
                        <Checkbox checked={alertModel.smsAlert?.ips} onChange={() => alertModel.setSmsAlert({...alertModel.smsAlert, ips: !alertModel.smsAlert?.ips})}
                        >Rule base</Checkbox>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={alertModel.loading[1]}> Lưu </Button>
                </Form>
            </Card>
        </div>
    )
}

export default AlertSelection