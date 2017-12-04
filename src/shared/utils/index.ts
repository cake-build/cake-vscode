import checkFilePath from './checkFilePath';
import checkForExisting from './checkForExisting';
import { Config } from './config';
import flattenNestedArray from './flattenNestedArray';
import getFetchOptions from './getFetchOptions';
import getFilePath from './getFilePath';
import handleError from './handleError';
import readConfigFile from './readConfigFile';
import showFileQuickPick from './showFileQuickPick';
import truncateFilePath from './truncateFilePath';
import { window } from 'vscode';

const showInformationMessage = window.showInformationMessage.bind(window);

export {
    checkFilePath,
    checkForExisting,
    Config,
    flattenNestedArray,
    getFetchOptions,
    getFilePath,
    handleError,
    readConfigFile,
    showFileQuickPick,
    truncateFilePath,
    showInformationMessage
};