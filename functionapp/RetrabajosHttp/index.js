const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');

module.exports = async function (context, req) {
  context.log('Retrabajos HTTP trigger received.');

  if (!req.body) {
    context.res = { status: 400, body: { error: 'No body' } };
    return;
  }

  const data = req.body;
  const timestamp = new Date().toISOString().replace(/[:.]/g,'-');
  const id = uuidv4();
  const blobName = `retrabajo-${timestamp}-${id}.json`;
  const containerName = process.env['RETRABAJOS_CONTAINER'] || 'retrabajos';

  try {
    const connStr = process.env['AZURE_STORAGE_CONNECTION_STRING'];
    if (!connStr) throw new Error('No AZURE_STORAGE_CONNECTION_STRING configured');

    const bsc = BlobServiceClient.fromConnectionString(connStr);
    const containerClient = bsc.getContainerClient(containerName);
    await containerClient.createIfNotExists({ access: 'private' });

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const content = JSON.stringify({ id, createdAt: new Date().toISOString(), payload: data }, null, 2);
    await blockBlobClient.upload(content, Buffer.byteLength(content));

    context.res = {
      status: 201,
      body: { id, blobName, container: containerName }
    };
  } catch (err) {
    context.log.error(err);
    context.res = { status: 500, body: { error: err.message } };
  }
};
