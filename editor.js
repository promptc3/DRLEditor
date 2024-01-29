import 'monaco-editor/esm/vs/editor/browser/coreCommands';
import 'monaco-editor/esm/vs/editor/contrib/find/browser/findController';

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';

self.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		return './editor.worker.bundle.js';
	}
};

// Register the custom language with id as drool
monaco.languages.register({id: 'drools'});

// Set tokens for drool grammar
monaco.languages.setMonarchTokensProvider('drools', {
    tokenizer: {
        roots:[
            [/\b(true|false|null)\b/, "custom-hard-keywords"],
            [/[<|>|==|<=|>=|.|!=]/, "custom-mathematical_operators"],
            [/\b(insert|insertLogical|delete|modify)\b/,"custom-drools-rhs"],
            [/\b(lock-on-active|date-effective|date-expires|no-loop|auto-focus|activation-group|agenda-group|ruleflow-group|entry-point|duration|package|import|dialect|salience|enabled|attributes|rule|extends|when|then|template|query|declare|function|global|eval|not|in|or|and|exists|forall|accumulate|collect|from|end|over|calendars|init|action|reverse|result|new)\b/, "custom-soft-keywords"],
            [/\$([A-Za-z][A-Za-z0-9_]+)/, "custom-bound-variables"],
            // [/\b([A-Z][A-Za-z_]+)\b/,"custom-java-class"],
            [/\/\/.*/,"custom-singleline-comment"],
            [/(\").*(\")/,"custom-doublequote-string"],
            [/([0-9]+(\\.)?[0-9]*)/,"custom-numbers"],
            [/\/\*[\s\S]*?\*\//, "custom-multiline-comment"]
        ]
    }
})

// Create a custom theme for monaco editor
monaco.editor.defineTheme("droolsTheme", {
    base: "vs",
    inherit: false,
    rules: [
        { token: "custom-hard-keywords", foreground: "00cccc"},
        { token: "custom-mathematical_operators", foreground: "000000"},
        { token: "custom-drools-rhs", foreground:"dbdb02"},
        { token: "custom-soft-keywords", foreground: "7f00ff"},
        { token: "custom-bound-variables", foreground:"0015ff"},
        // { token: "custom-java-class", foreground:"808080"},
        { token: "custom-singleline-comment", foreground: "00b208"},
        { token: "custom-doublequote-string", foreground:"f96502"},
        { token: "custom-numbers", foreground: "429aaf"},
        { token: "custom-multiline-comment", foreground: "00b208"}
    ],
    colors: {
        "editor.foreground": "#000000",
    },
});

// Create a new editor instance
export function createEditor(value) {
    let snippet =
        `rule "Underage"
        when
            /applicants[ applicantName : name, age < 21 ]
            $application : /loanApplications[ applicant == applicantName ]
        then
            $application.setApproved( false );
            $application.setExplanation( "Underage" );
            update($application);
        end`;
    const defaultVal = value ?? snippet;
    try {
        monaco.editor.create(document.getElementById('monaco-editor'), {
            value: defaultVal,
            theme: 'droolsTheme',
            language: 'drools', // Set the language to your custom language
        });
    } catch (error) {
        console.error("Unable to create editor", error);
    }
}

/* We can create a keybinding like this -
    var myBinding = editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, function() {
        alert('Save pressed!');
    });
    Alternatively we can create a chord like this -
    var KM = monaco.KeyMod;
    var KC = monaco.KeyCode;
    editor.addCommand(KM.chord(KM.CtrlCmd | KC.KEY_K, KM.CtrlCmd | KC.KEY_M), function() {
        //...
    });
*/
export function createAction(action, keys) {
    const defaultAction = action ?? function() { console.log("Right arrow pressed.") }
    const kB = (keys && typeof keys == Array) ?? [monaco.KeyCode.RightArrow];
    const actionDescriptor = {
            id: "run-code",
            label: "Run Code",
            contextMenuOrder: 2,
            contextMenuGroupId: "1_modification",
            keybindings: kB,
            run: defaultAction
    };
    try {
        monaco.editor.addEditorAction(actionDescriptor);
    } catch (error) {
       console.error(`Unable to add action: ${actionDescriptor} with keybinding: ${keyChord}.`, error) ;
    }
}

export function getValue() {
    return monaco.editor.getModels()[0].getValue();
}