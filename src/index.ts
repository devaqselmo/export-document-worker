import { SQSClient } from "@aws-sdk/client-sqs";
import { Consumer } from "sqs-consumer";
import { handleExport } from "./handlers/export.js";
import { env } from "./utils/config.js";
import { parseExportMessage } from "./utils/message.js";

const consumer = Consumer.create({
  queueUrl: env.SQS_QUEUE_URL,
  sqs: new SQSClient({ region: env.AWS_REGION }),
  handleMessage: async (message) => {
    await handleExport(parseExportMessage(message.Body ?? ""));
  },
});

consumer.on("error", (err) => console.error(err));
consumer.on("processing_error", (err) => console.error(err));

process.on("SIGTERM", () => consumer.stop());

consumer.start();
