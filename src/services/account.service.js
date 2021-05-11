const { runQuery } = require("../config/database.config");
const { makeGetRequest } = require("../utilities/axios.utilities");

const {
  findAccountByAccountName,
  findAccountByAccountId,
  addAccountQuery,
  updateAccountQuery,
  deleteAccountQuery,
  getAllAccounts,
} = require("../queries/account");

const getAccounts = async () => {
  const accounts = await runQuery(getAllAccounts);
  return {
    status: "success",
    message: "Account fetched succesfully",
    code: 200,
    data: accounts,
  };
};

const addAccount = async (body, user_id) => {
  const { account_name, bank, bank_code, balance, type_of_account } = body;

  const account = await runQuery(findAccountByAccountName, [account_name]);
  if (account.length > 0) {
    throw {
      status: "error",
      message: "Account already exist",
      code: 409,
      data: null,
    };
  }
  const published_at = new Date();
  const response = await runQuery(addAccountQuery, [
    account_name,
    bank,
    bank_code,
    balance,
    type_of_account,
    user_id,
    published_at,
  ]);

  return {
    status: "success",
    message: "Account created successfully",
    code: 201,
    data: response[0],
  };
};

const updateAccount = async (id, body) => {
  const { account_name, bank, bank_code, balance, type_of_account } = body;

  const account = await runQuery(findAccountByAccountId, [id]);
  console.log(account_name);
  if (account.length === 0) {
    throw {
      status: "error",
      message: " Bank Account not found",
      code: 400,
      data: null,
    };
  }
  const response = await runQuery(updateAccountQuery, [
    account_name,
    bank,
    bank_code,
    balance,
    type_of_account,
    id,
  ]);
  return {
    status: "success",
    message: "Bank Account details updated successfully",
    code: 200,
    data: response[0],
  };
};

const deleteAccount = async (id) => {
  const account = await runQuery(findAccountByAccountId, [id]);
  if (account.length === 0) {
    accounts.splice(account, 1);
    throw {
      status: "error",
      message: "Account does not exist",
      code: 400,
      data: null,
    };
  }
  const response = await runQuery(deleteAccountQuery, [id]);

  return {
    status: "success",
    message: "Account deleted successfully",
    code: 200,
    data: response[0],
  };
};

const getBanks = async () => {
  const url = process.env.BANKS_URL;
  const response = await makeGetRequest(url);
  return {
    code: 200,
    status: "success",
    data: response.data,
  };
};

const validateCustomer = async (body) => {
  const { account_number, bank_code } = body;
  const url = `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`;
  const response = await makeGetRequest(url);
  return {
    code: 200,
    status: "success",
    data: response.data,
  };
};

module.exports = {
  getAccounts,
  addAccount,
  updateAccount,
  deleteAccount,
  getBanks,
  validateCustomer,
};
