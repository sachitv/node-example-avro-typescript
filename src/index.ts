
import { readFile, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import { AvroReader, AvroWriter, InMemoryReadableBuffer, createType } from "@sachitv/avro-typescript";
import { InfiniteInMemoryBuffer } from "./buffer.js";
import { schema, users } from "./shared.js";

// Create a Type from the schema
const userType = createType(schema);

async function main() {
  console.log("Running Avro TypeScript example...");

  // Write user data to an in-memory buffer using AvroWriter
  const memoryBuffer = new InfiniteInMemoryBuffer();
  const writer = AvroWriter.toBuffer(memoryBuffer, { schema: userType });
  const numWritten = users.length;

  for (const user of users) {
    await writer.append(user);
  }
  await writer.close();
  console.log(`Data written to in-memory buffer: ${numWritten} records.`);

  // Save the in-memory buffer to an Avro file
  const avroBuffer = memoryBuffer.getBuffer();
  const filePath = `${tmpdir()}/users-${randomUUID()}.avro`;
  await writeFile(filePath, avroBuffer);
  console.log(`In-memory buffer saved to ${filePath}`);

  // Read the Avro file back into a buffer
  const fileContent = await readFile(filePath);
  const readableBuffer = fileContent.buffer.slice(fileContent.byteOffset, fileContent.byteOffset + fileContent.byteLength);
  console.log(`${filePath} read back into a buffer.`);

  // Use AvroReader to parse the data and log it to the console
  const reader = AvroReader.fromBuffer(new InMemoryReadableBuffer(readableBuffer));
  console.log("Reading records from Avro file:");
  let numRead = 0;
  for await (const record of reader.iterRecords()) {
    console.log(record);
    numRead++;
  }
  await reader.close();

  if (numRead !== numWritten) {
    console.error(`Record count mismatch: wrote ${numWritten}, read ${numRead}`);
  } else {
    console.log(`Record count verified: ${numRead} records read match ${numWritten} written.`);
  }

  console.log("Example finished.");
}

main().catch(console.error);
