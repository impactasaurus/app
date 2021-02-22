// originated from github.com/ALDLife/outcome-graph

import moment from 'moment';
import {getHumanisedDateFromISO} from 'helpers/moment';
import {OutcomeGraphData, IOutcomeGraphSeries} from './index';

// module pattern
export function SessionsConverter() {
  // variable to keep track of different labels
  let labels = [];
  // labels set for checking if label is unique
  let labelSet = {};

  function init() {
    labels = [];
    labelSet = {};
  }

  function getConvertedSessions(sessions: OutcomeGraphData) {
    const convertedSessions = [];
    sessions.forEach(function sessionIterator(session: IOutcomeGraphSeries) {
      convertedSessions.push(getConvertedSession(session));
    });
    return convertedSessions;
  }

  function getConvertedSession(session: IOutcomeGraphSeries) {

    const outcomes = session.outcomes;
    // data set item for session
    const convertedSession: any = {};

    convertedSession.label =  moment(session.timestamp).isValid() ?
      getHumanisedDateFromISO(session.timestamp) :
      session.timestamp;

    // adding the values map to converted session for developer to view for possible debugging
    convertedSession.valuesMap = getValuesMapsFromOutcomes(outcomes);

    // extract data and notes arrays
    const extractedDataAndNotes = getExtractedDataAndTooltipNotes(convertedSession.valuesMap);
    convertedSession.data = extractedDataAndNotes.data;
    convertedSession.notes = extractedDataAndNotes.notes;

    if (session.disabled === true) {
      convertedSession.hidden = true;
    }

    return convertedSession;
  }

  // this creates a mapping of the data value as well as notes for each label
  // to be later used to create the ChartJS data array
  function getValuesMapsFromOutcomes(outcomes) {
    const dataMap = {};
    const noteMap = {};
    // add each outcome to a set
    outcomes.forEach(function outcomeIterator(outcome) {
      const lowerCaseLabel = updateLabels(outcome.outcome);
      dataMap[lowerCaseLabel] = outcome.value;
      noteMap[lowerCaseLabel] = outcome.notes;
    });
    return {
      data: dataMap,
      notes: noteMap,
    };
  }

  // check if our set has the value or not
  function updateLabels(potentialLabel) {
    const lowerCaseLabel = potentialLabel.toLowerCase();
    if (!Object.prototype.hasOwnProperty.call(labelSet, lowerCaseLabel)) {
      labels.push(potentialLabel);
      // now value is in our set
      labelSet[lowerCaseLabel] = true;
    }
    return lowerCaseLabel;
  }

  // Use values map to create the data and notes arrays confroming to
  // ChartJS requirements.
  function getExtractedDataAndTooltipNotes(valuesMap) {
    // go over currently added labels
    const data = [];
    const notes = [];
    labels.forEach(function labelIterator(label) {
      data.push(getExtractedDataValue(valuesMap.data[label.toLowerCase()]));
      notes.push(getExtractedNoteValue(valuesMap.notes[label.toLowerCase()]));
    });
    return {
      data,
      notes,
    };
  }

  function getExtractedDataValue(dataValue) {
    return typeof dataValue === 'undefined' ? null : dataValue;
  }

  function getExtractedNoteValue(noteValue) {
    return typeof noteValue === 'undefined' ? 'none' : noteValue;
  }

  function getLabels() {
    return labels;
  }

  return {
    getChartJSConvertedData: function getChartJSConvertedData(sessions: OutcomeGraphData) {
      init();
      return {
        datasets: getConvertedSessions(sessions),
        labels: getLabels(),
      };
    },
  };
}
