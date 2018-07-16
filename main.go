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
  "bufio"
  "io/ioutil"
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

func ContainersCreateHandler(w http.ResponseWriter, r *http.Request) {
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

  //Setup Request
  req, err := http.NewRequest(http.MethodPost, "https://192.168.0.45:48433/containers/create", r.Body)
  if err != nil {
    panic(err)
  }
  req.Header.Set("Account", "testme1")
  req.Header.Set("Access-Key", "B5vjH1UvTp8_yXgE8S05ZA==")
  req.Header.Set("Secret-Key", "ujndTr42r-uohAsoruyUTPsxqbITKLhDkNgRDWiUIBKabg6T6NVnV7s-6t5nFdtQZND7_i7tQuezxySIFSOkBA==")

  //Send Request
  //resp, err := secureClient.PostForm("https://192.168.0.45:48433/containers/list", url.Values{"account": {"test1"}, "access_key": {"WYhb0LmOU1dBa4sLcLULhg=="}, "secret_key": {"dGoxPUY5TTTYsWbEEG76s-ZKfXNyTi2-8UFIzuXdo7VQUSRjjk8L6sHd1gBRgSmhYZr5A48F4Oz0MTnrB_X17Q=="}})
  resp, err := secureClient.Do(req)
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


func ContainersListHandler(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/json; charset=UTF-8")
  w.WriteHeader(http.StatusOK)
  defer r.Body.Close()
  testme := r.RequestURI[4:len(r.RequestURI)]
  fmt.Println(testme)
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

func ApiHandler(w http.ResponseWriter, r *http.Request) {
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

  //Setup Request
  strippedUri := r.RequestURI[4:len(r.RequestURI)]
  req, err := http.NewRequest(http.MethodPost, "https://192.168.0.45:48433" + strippedUri, r.Body)
  if err != nil {
    panic(err)
  }
  req.Header.Set("Account", "testme1")
  req.Header.Set("Access-Key", "B5vjH1UvTp8_yXgE8S05ZA==")
  req.Header.Set("Secret-Key", "ujndTr42r-uohAsoruyUTPsxqbITKLhDkNgRDWiUIBKabg6T6NVnV7s-6t5nFdtQZND7_i7tQuezxySIFSOkBA==")

  //Send Request
  //resp, err := secureClient.PostForm("https://192.168.0.45:48433/containers/list", url.Values{"account": {"test1"}, "access_key": {"WYhb0LmOU1dBa4sLcLULhg=="}, "secret_key": {"dGoxPUY5TTTYsWbEEG76s-ZKfXNyTi2-8UFIzuXdo7VQUSRjjk8L6sHd1gBRgSmhYZr5A48F4Oz0MTnrB_X17Q=="}})
  resp, err := secureClient.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

  reader := bufio.NewReader(resp.Body)
  respBody, _ := ioutil.ReadAll(reader)
  w.Write(respBody)
}

var caPtr = flag.String("ca", "", "CA cert for the cluster. (Required)")
var accountPtr = flag.String("account", "", "Sevice account name. (Required)")
var accessKeyPtr = flag.String("access-key", "", "Sevice account access key. (Required)")
var secretKeyPtr = flag.String("secret-key", "", "Sevice account secret key. (Required)")

var ca string
var account string
var accessKey string
var secretKey string


func main(){
  flag.Parse()

  if(*caPtr == ""){
    if env := os.Getenv("MOZART_CA"); env == "" {
      log.Fatal("Must provide a CA cert.")
    } else {
      caPtr = &env
      ca = *caPtr
    }
  } else {
    ca = *caPtr
  }

  if(*accountPtr == ""){
    if env := os.Getenv("MOZART_ACCOUNT"); env == "" {
      log.Fatal("Must provide a service account name.")
    } else {
      accountPtr = &env
      account = *accountPtr
    }
  } else {
    account = *accountPtr
  }

  if(*accessKeyPtr == ""){
    if env := os.Getenv("MOZART_ACCESS_KEY"); env == "" {
      log.Fatal("Must provide a service access key.")
    } else {
      accessKeyPtr = &env
      accessKey = *accessKeyPtr
    }
  } else {
    accessKey = *accessKeyPtr
  }

  if(*secretKeyPtr == ""){
    if env := os.Getenv("MOZART_SECRET_KEY"); env == "" {
      log.Fatal("Must provide a service secret key.")
    } else {
      secretKeyPtr = &env
      secretKey = *secretKeyPtr
    }
  } else {
    secretKey = *secretKeyPtr
  }

  router := mux.NewRouter().StrictSlash(true)

  //The below routes use a variable to trick it into catching all paths, therefore this will support 4 deep after /api
  router.HandleFunc("/api/{catch1}", ApiHandler)
  router.HandleFunc("/api/{catch1}/{catch2}", ApiHandler)
  router.HandleFunc("/api/{catch1}/{catch2}/{catch3}", ApiHandler)
  router.HandleFunc("/api/{catch1}/{catch2}/{catch3}/{catch4}", ApiHandler)
	router.PathPrefix("/").Handler(http.FileServer(http.Dir("./app")))

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
