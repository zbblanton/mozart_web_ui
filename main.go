package main

import(
  "net/http"
  "flag"
  "github.com/gorilla/mux"
	"github.com/rs/cors"
  //"strings"
  "os"
  //"os/exec"
  "encoding/json"
  "fmt"
  "time"
  "crypto/x509"
  "log"
  "crypto/tls"
  "net/url"
)

type Container struct {
  Name string
  State string
  DesiredState string
  Config ContainerConfig
  Worker string
}

type ContainerConfig struct {
	Name string
	Image string
	ExposedPorts []ExposedPort
	Mounts []Mount
	Env []string
	AutoRemove bool
	Privileged bool
}

type ExposedPort struct {
	ContainerPort string
	HostPort string
	HostIp string
}

type Mount struct {
	Target string
	Source string
	Type string
	ReadOnly bool
}

type ContainerListResp struct {
  Containers map[string]Container
  Success bool `json:"success"`
  Error string `json:"error"`
}

type Account struct {
  Type string
  Name string
  Password string
  AccessKey string
  SecretKey string
  Description string
}

type AccountsListResp struct {
  Accounts map[string]Account
  Success bool `json:"success"`
  Error string `json:"error"`
}

type Resp struct {
  Success bool `json:"success"`
  Error string `json:"error"`
}

func AccountsListHandler(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/json; charset=UTF-8")
  w.WriteHeader(http.StatusOK)
  defer r.Body.Close()

  //Create a new cert pool
	rootCAs := x509.NewCertPool()

	// Append our ca cert to the system pool
	if ok := rootCAs.AppendCertsFromPEM([]byte(*caPtr)); !ok {
		fmt.Println("No certs appended, using system certs only")
	}

  //Trust cert pool in our client
	clientConfig := &tls.Config{
		InsecureSkipVerify: false,
		RootCAs:            rootCAs,
	}
	clientTr := &http.Transport{TLSClientConfig: clientConfig}
	secureClient := &http.Client{Transport: clientTr, Timeout: time.Second * 5}

  //Send Request
  resp, err := secureClient.PostForm("https://192.168.0.45:48433/accounts/list", url.Values{"account": {"test1"}, "access_key": {"WYhb0LmOU1dBa4sLcLULhg=="}, "secret_key": {"dGoxPUY5TTTYsWbEEG76s-ZKfXNyTi2-8UFIzuXdo7VQUSRjjk8L6sHd1gBRgSmhYZr5A48F4Oz0MTnrB_X17Q=="}})
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

  //Decode response body
  respBody := AccountsListResp{}
  json.NewDecoder(resp.Body).Decode(&respBody)
  fmt.Println(respBody)
  resp1 := AccountsListResp{respBody.Accounts, true, ""}
  json.NewEncoder(w).Encode(resp1)
}

func ContainersListHandler(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/json; charset=UTF-8")
  w.WriteHeader(http.StatusOK)
  defer r.Body.Close()

  //Create a new cert pool
	rootCAs := x509.NewCertPool()

	// Append our ca cert to the system pool
	if ok := rootCAs.AppendCertsFromPEM([]byte(*caPtr)); !ok {
		fmt.Println("No certs appended, using system certs only")
	}

  //Trust cert pool in our client
	clientConfig := &tls.Config{
		InsecureSkipVerify: false,
		RootCAs:            rootCAs,
	}
	clientTr := &http.Transport{TLSClientConfig: clientConfig}
	secureClient := &http.Client{Transport: clientTr, Timeout: time.Second * 5}

  //Send Request
  resp, err := secureClient.PostForm("https://192.168.0.45:48433/containers/list", url.Values{"account": {"test1"}, "access_key": {"WYhb0LmOU1dBa4sLcLULhg=="}, "secret_key": {"dGoxPUY5TTTYsWbEEG76s-ZKfXNyTi2-8UFIzuXdo7VQUSRjjk8L6sHd1gBRgSmhYZr5A48F4Oz0MTnrB_X17Q=="}})
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

  //Decode response body
  respBody := ContainerListResp{}
  json.NewDecoder(resp.Body).Decode(&respBody)
  fmt.Println(respBody)
  resp1 := ContainerListResp{respBody.Containers, true, ""}
  json.NewEncoder(w).Encode(resp1)
}

var caPtr = flag.String("ca", "", "CA cert for the cluster. (Required)")

func main(){
  if(*caPtr == ""){
    if env := os.Getenv("MOZART_CA"); env == "" {
      log.Fatal("Must provide a CA cert.")
    } else {
      caPtr = &env
    }
  }

  router := mux.NewRouter().StrictSlash(true)

  router.HandleFunc("/api/accounts/list", AccountsListHandler)
  router.HandleFunc("/api/containers/list", ContainersListHandler)
	router.PathPrefix("/").Handler(http.FileServer(http.Dir("./app")))
  //router.HandleFunc("/api/create", CreateHandler)
  //router.HandleFunc("/api/stop/{container}", StopHandler)
  //router.HandleFunc("/api/status/{container}", RootHandler)
  //router.HandleFunc("/api/inspect/{container}", RootHandler)

  handler := cors.Default().Handler(router)
	err := http.ListenAndServe(":8000", handler)

  // server := &http.Server{
  //       Addr: ":" + "8000",
  //       Handler: handler,}
  //
  //
  // //Start server
  // //err = server.ListenAndServeTLS("", "")
  // err := server.ListenAndServe()
  log.Fatal(err)
}
