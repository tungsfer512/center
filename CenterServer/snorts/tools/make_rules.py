import pandas as pd
import numpy as np
import math
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn import tree
from sklearn.metrics import accuracy_score
from sklearn.metrics import confusion_matrix
from sklearn.metrics import classification_report
from graphviz import Source

def auto_make_rules(df = pd.DataFrame()):
    # FILE_DIR = f"./snorts/tools/csv/"
    # ATTACK_FILE_PATH = f"{FILE_DIR}/{attack_file}"
    # BENIGN_FILE_PATH = f"{FILE_DIR}/{benign_file}"
    
    # df_attack = pd.read_csv(ATTACK_FILE_PATH)
    # df_benign = pd.read_csv(BENIGN_FILE_PATH)

    i = 0
    df_split = np.array_split(df, df.shape[0]/10)
    print(type(df_split[0]))
    # return

    df['Label'].value_counts()

    # %%
    df_label = df['Label']
    df = df.drop(['Label'], axis=1)
    df = pd.get_dummies(df, columns=['Protocol'], drop_first=True)
    df = pd.concat([df, df_label], axis=1)
    df.head()

    # %%
    df = df.drop([
        'Timestamp',
        # 'Protocol',
        'Subflow Fwd Pkts',
        'RST Flag Cnt',
        'ACK Flag Cnt',
        "PSH Flag Cnt",
        "Init Fwd Win Byts",
        'Idle Mean',
        'Idle Std',
        'Idle Max',
        'Idle Min',
        'Fwd PSH Flags',
        'Bwd PSH Flags',
        'Fwd URG Flags',
        'Bwd URG Flags',
        'Flow Byts/s',  # This field had np.inf values during training, as such was removed
        'Flow Pkts/s'], axis=1)

    # %%
    # relace the label with 0 and 1, Benign = 0, any other = 1
    df_benign = df[df['Label'] == 'Benign']
    df_benign['Label'] = 0

    df_attack = df[df['Label'] != 'Benign']
    df_attack['Label'] = 1

    df = pd.concat([df_benign, df_attack], ignore_index=True)
    df.head()

    # %%
    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    df.dropna(inplace=True)
    # df.drop_duplicates(inplace=True)
    df['Label'].value_counts()

    # %%
    # blanced the data
    n1 = df['Label'].value_counts()[1]
    n0 = df['Label'].value_counts()[0]
    n = min(n1, n0)
    df_0 = df[df['Label'] == 0].sample(n=n, random_state=1)
    df_1 = df[df['Label'] == 1].sample(n=n, random_state=1)
    df = pd.concat([df_0, df_1], ignore_index=True)
    df['Label'].value_counts()

    # %%
    # train test split
    X = df.drop('Label', axis=1)
    y = df['Label']
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42)
    print(X_train.shape, X_test.shape, y_train.shape, y_test.shape)

    # %%
    # # normalize the data
    # from sklearn.preprocessing import StandardScaler, MinMaxScaler
    # scaler = StandardScaler()
    # scaler = MinMaxScaler()
    # X_train = scaler.fit_transform(X_train)
    # X_test = scaler.transform(X_test)

    # %%
    classifier = DecisionTreeClassifier(
        criterion='gini', max_depth=10, class_weight='balanced', random_state=42)
    classifier.fit(X_train, y_train)
    y_pred = classifier.predict(X_test)

    # evaluate the model
    print('Accuracy:\n ', accuracy_score(y_test, y_pred))
    print('Confusion Matrix:\n ', confusion_matrix(y_test, y_pred))
    print('Classification Report:\n ', classification_report(y_test, y_pred))

    # %%
    # predict the test data
    y_pred = classifier.predict(X_test)
    for i in range(10):
        print('Predicted: ', y_pred[i], 'Actual: ', y_test.iloc[i])

    # Visulaizing the tree using graphviz
    graph = Source(tree.export_graphviz(classifier, out_file=None, feature_names=X.columns, class_names=['Benign', 'Attack'], rounded=True, filled=True))
    
    # export image
    graph.format = 'png'
    graph.render('./snorts/tools/images/tree', view=False)

    clf = classifier
    n_nodes = clf.tree_.node_count
    children_left = clf.tree_.children_left
    children_right = clf.tree_.children_right
    feature = clf.tree_.feature
    threshold = clf.tree_.threshold

    feature_name = df.columns

    label_name = ["Benign", "Attack"]

    node_depth = np.zeros(shape=n_nodes, dtype=np.int64)
    is_leaves = np.zeros(shape=n_nodes, dtype=bool)
    stack = [(0, 0)]

    while len(stack) > 0:
        # `pop` ensures each node is only visited once
        node_id, depth = stack.pop()
        node_depth[node_id] = depth

        # If the left and right child of a node is not the same we have a split
        # node
        is_split_node = children_left[node_id] != children_right[node_id]
        # If a split node, append left and right children and depth to `stack`
        # so we can loop through them
        if is_split_node:
            stack.append((children_left[node_id], depth + 1))
            stack.append((children_right[node_id], depth + 1))
        else:
            is_leaves[node_id] = True

    leaves = []

    for i in range(n_nodes):
        if is_leaves[i]:
            print(
                "{space}node={node} is a leaf node with value {value}".format(
                    space=node_depth[i] * "\t", node=i, value=label_name[clf.classes_[np.argmax(clf.tree_.value[i])]]
                )
            )
            leaves.append(i)
        else:
            print(
                "{te_space}node={te_node} is a split node: "
                "go to node {te_left} if {te_feature} <= {te_threshold} "
                "else to node {te_right}.".format(
                    te_space=node_depth[i] * "\t",
                    te_node=i,
                    te_left=children_left[i],
                    te_feature=feature_name[feature[i]],
                    te_threshold=threshold[i],
                    te_right=children_right[i],
                )
            )
    # print(res)

    ancestor = [-1] * n_nodes
    print(ancestor)
    for i in range(n_nodes):
        if not is_leaves[i]:
            ancestor[children_left[i]] = i
            ancestor[children_right[i]] = i
    print(ancestor)

    def make_rule(leaf):
        res = []
        te = leaf
        res.append(leaf)
        while te != 0:
            res .append(ancestor[te])
            te = ancestor[te]

        res.reverse()
        rule = []
        for i in range(1, len(res)):
            if res[i] == children_left[res[i - 1]]:
                rule.append({
                    "criteria": f"{feature_name[feature[res[i - 1]]]}",
                    "threshold": threshold[res[i - 1]],
                    "compare": "<="
                })
            if res[i] == children_right[res[i - 1]]:
                rule.append({
                    "criteria": f"{feature_name[feature[res[i - 1]]]}",
                    "threshold": threshold[res[i - 1]],
                    "compare": ">"
                })
        return rule

    conditions = []

    for leaf in leaves:
        if label_name[clf.classes_[np.argmax(clf.tree_.value[leaf])]] == "Attack":
            print(make_rule(leaf))
            conditions.append(make_rule(leaf))

    result = []
    protocols = ["tcp", "udp", "icmp"]
    for protocol in protocols:
        for row in conditions:
            structure = f'alert {protocol} any any -> any <%port_min%>:<%port_max%> (msg:"attack"; dsize:<$dsize_min>:<$dsize_max>; sid:<$sid>; rev:1;)'
            dsize = []
            dst_port = []
            for condition in row:
                if condition["criteria"] == "Dst Port":
                    dst_port.append({
                        "compare": condition["compare"],
                        "threshold": condition["threshold"],
                    })
                elif condition["criteria"] == "Fwd Seg Size Min":
                    dsize.append({
                        "compare": condition["compare"],
                        "threshold": condition["threshold"],
                    })

            print(dsize, dst_port)
            if len(dst_port) == 1:
                if dst_port[0]['compare'] == '<=':
                    structure = structure.replace(
                        "<%port_min%>:<%port_max%>", f":{math.floor(dst_port[0]['threshold'])}")
                else:
                    structure = structure.replace(
                        "<%port_min%>:<%port_max%>", f"{math.ceil(dst_port[0]['threshold'])}:")
            elif len(dst_port) == 0:
                structure = structure.replace("<%port_min%>:<%port_max%>", "any")
            else:
                greater = []
                less = []
                for port in dst_port:
                    if port['compare'] == "<=":
                        less.append(port['threshold'])
                    else:
                        greater.append(port['threshold'])
                if len(less) > 0:
                    minn = np.min(less)
                    minn = math.ceil(minn)
                else:
                    minn = ""
                if len(greater) > 0:
                    maxx = np.max(greater)
                    maxx = math.floor(maxx)
                else:
                    maxx = ""
                structure = structure.replace(
                    "<%port_min%>:<%port_max%>",  f"{maxx}:{minn}")
            if len(dsize) == 1:
                if dsize[0]['compare'] == '<=':
                    structure = structure.replace(
                        "<$dsize_min>:<$dsize_max>", f"<{math.floor(dsize[0]['threshold'])}")
                else:
                    structure = structure.replace(
                        "<$dsize_min>:<$dsize_max>", f">{math.ceil(dsize[0]['threshold'])}")
            elif len(dsize) == 0:
                structure = structure.replace(" dsize:<$dsize_min>:<$dsize_max>;", "")
            else:
                greater = []
                less = []
                for size in dsize:
                    if size['compare'] == "<=":
                        less.append(size['threshold'])
                    else:
                        greater.append(size['threshold'])
                if len(less) > 0:
                    minn = np.min(less)
                    minn = math.ceil(minn)
                else:
                    minn = ""
                if len(greater) > 0:
                    maxx = np.max(greater)
                    maxx = math.floor(maxx)
                else:
                    maxx = ""
                structure = structure.replace(
                    "<$dsize_min>:<$dsize_max>", f"{maxx}<>{minn}")
            if structure not in result:
                result.append(structure)
    
    res = list(set(result))
    sid = 1000001
    for i in range(len(res)):
        res[i] = res[i].replace("<$sid>", str(sid))
        sid += 1
    ress = []
    for rule in res:
        if " :" not in rule and ": " not in rule and "dsize:>" not in rule and "<>" not in rule and "-> any any" not in rule:
            ress.append(rule)
    return ress


if __name__ == "__main__":
    df = pd.read_csv("./data_400k.csv")
    auto_make_rules(df)