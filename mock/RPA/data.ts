export default {
  /** --- 9. 数据采集管理 (Collection) --- */
  // 9.1 分页列表（包含 statistics 统计对象）
  'GET /api/v1/system/data/collection/list': (req: any, res: any) => {
    res.send({
      code: 200,
      message: 'success',
      data: {
        total: 1,
        pages: 1, //
        size: 10, //
        current: 1, //
        statistics: {
          totalCollection: 16,
          success: 5,
          collecting: 1,
          failed: 1,
        }, //
        records: [
          {
            id: 2033726326860492804,
            taskId: '2033725144572071170',
            status: 'collected',
            taxNo: '91500000MA5U123456',
            enterpriseName: '重庆某某科技有限公司',
            dataSource: 'study-spider-demo',
            collectionTime: '2026-03-17T16:05:52',
          },
        ],
      },
    });
  },
  // 9.2 查看详情
  'GET /api/v1/system/data/collection/detail/:id': (req: any, res: any) => {
    res.send({
      code: 200,
      message: 'success',
      data: {
        taskId: '2033725144572071170',
        taxNo: '91500000MA5U123456',
        enterpriseName: '重庆某某科技有限公司',
        status: 'collected',
        dataSource: 'study-spider-demo',
        collectionTime: '2026-03-17T16:05:52',
        errorMessage: '',
        rawData:
          '{"source":"study-spider-demo","site":"http://study.zmyfrank.com:18010/spider/home"}', //
      },
    });
  },
  // 9.3 删除
  'DELETE /api/v1/system/data/collection/delete/:id': (req: any, res: any) => {
    res.send({ code: 200, message: 'success', data: null }); //
  },
  // 9.4 新增
  'POST /api/v1/system/data/collection/add': (req: any, res: any) => {
    res.send({ code: 200, message: 'success', data: null }); //
  },

  /** --- 10. 数据解析管理 (Parsing) --- */
  // 10.1 分页列表
  'GET /api/v1/system/data/parsing/list': (req: any, res: any) => {
    res.send({
      code: 200,
      message: 'success',
      data: {
        total: 1,
        pages: 1, //
        size: 10, //
        current: 1, //
        statistics: { totalParsing: 15, success: 10, parsing: 0, failed: 0 }, //
        records: [
          {
            id: 11,
            taskId: '2033725144572071170',
            collectionId: '2033726326860492814',
            status: 'parsed',
            extractFieldCount: null, //
            parseRule: null, //
            parsingTime: '2026-03-17T16:05:52',
          },
        ],
      },
    });
  },
  // 10.2 查看详情
  'GET /api/v1/system/data/parsing/detail/:id': (req: any, res: any) => {
    res.send({
      code: 200,
      message: 'success',
      data: {
        taskId: '2033725144572071170',
        collectionId: '2033726326860492814',
        taxNo: '91500000MA5U123456', //
        enterpriseName: '重庆某某科技有限公司', //
        status: 'parsed', //
        parsingTime: '2026-03-17T16:05:52', //
        errorMessage: '', //
        parsedData:
          '{"enterpriseName":"重庆某某科技有限公司","taxNo":"91500000MA5U123456"}', //
      },
    });
  },
  // 10.3 删除
  'DELETE /api/v1/system/data/parsing/delete/:id': (req: any, res: any) => {
    res.send({ code: 200, message: 'success', data: null }); //
  },

  /** --- 11. 数据加工管理 (Processing) --- */
  // 11.1 分页列表
  'GET /api/v1/system/data/processing/list': (req: any, res: any) => {
    res.send({
      code: 200,
      message: 'success',
      data: {
        total: 1,
        pages: 1, //
        size: 10, //
        current: 1, //
        statistics: {
          totalProcessing: 15,
          success: 10,
          processing: 0,
          failed: 0,
        }, //
        records: [
          {
            id: 5,
            taskId: '2033725144572071170',
            parsingId: '16',
            status: 'processed',
            validationResult: '未通过', //
            processingTime: '2026-03-17T16:35:35', //
          },
        ],
      },
    });
  },
  // 11.2 查看详情
  'GET /api/v1/system/data/processing/detail/:id': (req: any, res: any) => {
    res.send({
      code: 200,
      message: 'success',
      data: {
        taskId: '2033725144572071170', //
        parsingId: '16', //
        taxNo: '91500000MA5U123456', //
        enterpriseName: '重庆某某科技有限公司', //
        status: 'processed', //
        processingTime: '2026-03-17T16:35:35', //
        errorMessage: '-', //
        processedData:
          '{"indicatorCode":"study_invoice_sale_sum_1_12m","enterpriseName":"重庆某某科技有限公司"}', //
        validationResult:
          '{"invoiceTotal":5,"invoiceMatched":0,"matchedInvoices":[]}', //
      },
    });
  },
  // 11.3 删除
  'DELETE /api/v1/system/data/processing/delete/:id': (req: any, res: any) => {
    res.send({ code: 200, message: 'success', data: null }); //
  },

  /** --- 12. 数据查询管理 (Query) --- */
  // 12.1 查询结果列表
  'GET /api/v1/system/data/query/list': (req: any, res: any) => {
    res.send({
      code: 200,
      message: 'success',
      data: {
        total: 1,
        pages: 1, //
        size: 10, //
        current: 1, //
        records: [
          {
            id: 7,
            taskId: '2033725144872071170',
            taxNo: '91500000MA5U123456',
            enterpriseName: '重庆某某科技有限公司',
            taxAreaId: null, //
            dataStatus: 'available', //
            createTime: '2026-03-17T16:35:35', //
          },
        ],
      },
    });
  },
  // 12.2 查看详情
  'GET /api/v1/system/data/query/detail/:id': (req: any, res: any) => {
    res.send({
      code: 200,
      message: 'success',
      data: {
        taskId: '2033725144872071170', //
        taxNo: '91500000MA5U123456', //
        enterpriseName: '重庆某某科技有限公司', //
        taxAreaId: null, //
        dataStatus: 'available', //
        createTime: '2026-03-17T16:35:35', //
        businessData:
          '{"source":"study-spider-demo","indicatorCode":"study_invoice_sale_sum_1_12m"}', //
      },
    });
  },
  // 12.3 删除
  'DELETE /api/v1/system/data/query/delete/:id': (req: any, res: any) => {
    res.send({ code: 200, message: 'success', data: null }); //
  },
};
