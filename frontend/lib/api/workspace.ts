// import { fetchApi } from "../api-client";
import { FileNode } from "../../app/[lng]/(chat)/components/center-panel/file-sidebar";

const MOCK_FILES: FileNode[] = [
  {
    id: "folder-1",
    name: "测试文件",
    type: "folder",
    path: "/test",
    children: [
      {
        id: "file-pdf-3",
        name: "arXiv 深度学习论文.pdf",
        type: "file",
        path: "/test/arxiv-2601-07708.pdf",
        url: "https://arxiv.org/pdf/2601.07708",
        mimeType: "application/pdf",
      },
      {
        id: "file-docx-1",
        name: "Word文档示例.docx",
        type: "file",
        path: "/test/sample.docx",
        url: "https://philfan-pic.oss-cn-beijing.aliyuncs.com/test/doc.docx",
        mimeType: "application/msword",
      },
      {
        id: "file-xlsx-1",
        name: "Excel表格示例.xlsx",
        type: "file",
        path: "/test/sample.xlsx",
        url: "https://philfan-pic.oss-cn-beijing.aliyuncs.com/test/xls.xlsx",
        mimeType: "application/vnd.ms-excel",
      },
      {
        id: "file-pptx-1",
        name: "PowerPoint演示文稿.ppt",
        type: "file",
        path: "/test/presentation.ppt",
        url: "https://philfan-pic.oss-cn-beijing.aliyuncs.com/test/ppt.pptx",
        mimeType: "application/vnd.ms-powerpoint",
      },
      {
        id: "file-image-1",
        name: "示例图片1.jpg",
        type: "file",
        path: "/test/image1.jpg",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        mimeType: "image/jpeg",
      },
    ],
  },
];

export const workspaceApi = {
  /**
   * 获取工作区文件列表 (目前返回 Mock 数据)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getFiles: async (sessionId?: string): Promise<FileNode[]> => {
    // 模拟网络延迟
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_FILES), 300);
    });
    // 后续接入 API:
    // const endpoint = sessionId ? `/workspace/files?session_id=${sessionId}` : "/workspace/files";
    // return fetchApi<FileNode[]>(endpoint);
  },
};
