import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType } from '@ant-design/pro-components';
import Editor, { loader } from '@monaco-editor/react';
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Tag,
} from 'antd';
import React, { useEffect, useRef } from 'react';
// 导入对应的保存和查询接口
import {
  getProcessSteps,
  saveProcessSteps,
} from '@/services/RPA/Processes/Processe';

// 配置 CDN 镜像，加速编辑器加载
loader.config({
  paths: { vs: 'https://lib.baomitu.com/monaco-editor/0.44.0/min/vs' },
});

type Props = {
  processCode: string; // 流程唯一标识
  visible: boolean; // 弹窗可见性
  onCancel: () => void; // 关闭回调
};

//函数组件
//父传子：通过属性名（如 visible）传递。
//子传父：通过调用父组件传下来的函数（如 onCancel）来通信
const ProcessDesignModal: React.FC<Props> = ({
  processCode,
  visible,
  onCancel,
}) => {
  const [form] = Form.useForm();

  // 当弹窗打开时，去后端加载已有的步骤数据 回调异步
  useEffect(() => {
    if (visible && processCode) {
      getProcessSteps(processCode).then((res) => {
        if (res.code === 200) {
          form.setFieldsValue({ steps: res.data || [] }); // 回显步骤数据
        }
      });
    }
  }, [visible, processCode]);
  const actionRef = useRef<ActionType>();
  // 保存所有步骤
  const handleSave = async () => {
    const values = await form.validateFields();
    // 构造后端要求的结构
    const res = await saveProcessSteps({
      processCode,
      steps: values.steps.map((item: any, index: number) => ({
        ...item,
        stepOrder: index + 1, // 自动生成序号
      })),
    });
    if (res.code === 200) {
      message.success('流程设计保存成功');

      onCancel();
    }
  };

  return (
    <Modal
      title="流程设计"
      open={visible} //父弹窗控制显示
      onCancel={onCancel}
      onOk={handleSave}
      width={1100}
      destroyOnClose
      okText="保存设计"
    >
      <Form form={form} layout="vertical">
        {/* Form.List 动态管理步骤数组 */}
        <Form.List name="steps">
          {/* 遍历card  内置新增与删除函数 */}
          {(fields, { add, remove }) => (
            <>
              {/* name是给表单用的 找到对应的字段 而index是显示序号 实际这两个值都一样 */}
              {fields.map(({ key, name, ...restField }, index) => (
                <Card
                  key={key}
                  size="small"
                  title={
                    <Space>
                      <Tag color="blue">{index + 1}</Tag> 步骤配置
                    </Space>
                  }
                  extra={
                    <DeleteOutlined
                      //调用得传递name索引
                      onClick={() => remove(name)}
                      style={{ color: 'red' }}
                    />
                  }
                  style={{ marginBottom: 16 }}
                >
                  <Space
                    align="baseline" //底线对齐
                    style={{ display: 'flex', marginBottom: 8 }}
                  >
                    {/* 展开属性 有name索引 */}
                    {/* 嵌套路径必须写数组 "steps[0].stepName" */}
                    <Form.Item
                      {...restField}
                      name={[name, 'stepName']}
                      label="步骤名称"
                      rules={[{ required: true }]}
                    >
                      <Input
                        placeholder="如：采集数据"
                        style={{ width: 300 }}
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'stepType']}
                      label="步骤类型"
                      initialValue="Java爬虫代码"
                    >
                      <Select
                        options={[
                          { label: 'Java', value: 'Java爬虫代码' },
                          { label: 'express', value: 'express脚本' },
                        ]}
                        style={{ width: 150 }}
                      />
                    </Form.Item>
                  </Space>

                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.steps?.[name]?.stepType !==
                      currentValues.steps?.[name]?.stepType
                    }
                  >
                    {() => {
                      const currentStepType = form.getFieldValue([
                        'steps',
                        name,
                        'stepType',
                      ]);
                      const editorLanguage =
                        currentStepType === 'express脚本' ? 'javascript' : 'java';

                      return (
                        <Form.Item
                          {...restField}
                          name={[name, 'codeContent']}
                          label="逻辑脚本 (Monaco Editor)"
                        >
                          <div
                            style={{ border: '1px solid #d9d9d9', height: '200px' }}
                          >
                            <Editor
                              height="100%"
                              language={editorLanguage}
                              theme="vs-dark"
                              options={{ minimap: { enabled: false }, fontSize: 13 }} //禁止缩写小地图
                              //实时触发 更新codeContent数据
                              onChange={(value) => {
                                //获取由对象构成的数组 {stepName: "采集数据",stepType:"",codeContent:""}
                                const steps = form.getFieldValue('steps');
                                steps[name].codeContent = value;
                                //修改后整改最新数据
                                form.setFieldsValue({ steps });
                              }}
                              // 初始值加载
                              //表单数据.steps[name].codeContent数组取值
                              value={form.getFieldValue([
                                'steps',
                                name,
                                'codeContent',
                              ])}
                            />
                          </div>
                        </Form.Item>
                      );
                    }}
                  </Form.Item>
                </Card>
              ))}
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                添加步骤
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default ProcessDesignModal;
