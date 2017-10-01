// originated from github.com/ALDLife/outcome-graph

import * as color from 'chartjs-color';
import * as moment from 'moment';
import * as distinctColors from 'distinct-colors';
import {getHumanisedTimeSinceDate} from 'helpers/moment';

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

  function getConvertedSessions(sessions) {
    const convertedSessions = [];
    // get distinct colours of all the different ones we could have
    const differentColours = distinctColors({count: sessions.length});
    sessions.forEach(function sessionIterator(session) {
      // remove the first element each time
      const sessionColour = differentColours.splice(0, 1)[0];
      convertedSessions.push(getConvertedSession(session, sessionColour));
    });
    return convertedSessions;
  }

  function getConvertedSession(session, chartColour) {

    const outcomes = session.outcomes;
    // data set item for session
    const convertedSession: any = {};

    if (moment(session.timestamp).isValid()) {
      convertedSession.label = getHumanisedTimeSinceDate(session.timestamp);
    } else {
      convertedSession.label = session.timestamp;
    }

    // adding the values map to converted session for developer to view for possible debugging
    convertedSession.valuesMap = getValuesMapsFromOutcomes(outcomes);

    // extract data and notes arrays
    const extractedDataAndNotes = getExtractedDataAndTooltipNotes(convertedSession.valuesMap);
    convertedSession.data = extractedDataAndNotes.data;
    convertedSession.notes = extractedDataAndNotes.notes;

    const colour = color().rgb(chartColour.rgba()).rgbString();
    convertedSession.backgroundColor = color(colour).alpha(0.2).rgbString();
    convertedSession.borderColor = colour;
    convertedSession.pointBackgroundColor = colour;

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
    if (!labelSet.hasOwnProperty(lowerCaseLabel)) {
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
    getChartJSConvertedData: function getChartJSConvertedData(sessions) {
      init();
      return {
        datasets: getConvertedSessions(sessions),
        labels: getLabels(),
      };
    },
  };
};
