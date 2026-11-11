import { reportAsyncError } from '../../utils/reportAsyncError';

export const dispatchTradingAction = (action: () => void): void => {
  try {
    void Promise.resolve(action()).catch(reportAsyncError);
  } catch (error) {
    reportAsyncError(error);
  }
};
